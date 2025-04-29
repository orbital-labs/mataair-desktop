import React, { useEffect } from "react";

import { shell } from "electron";
import { useMutation } from "@tanstack/react-query";
import {
  AutoCenter,
  Button,
  Divider,
  Form,
  Input,
  Space,
  Toast
} from "antd-mobile";
import { Link, useLocation, useNavigate } from "react-router-dom";
import googleIcon from "@/assets/icons/google_g_icon.png";

import Layout from "@/components/layout";
import { setAuth, useAppContext } from "@/contexts/index";
import type { Login } from "@/types";
import fetcher, { Response } from "@/utils/fetcher";

export default function Login() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const redirect = new URLSearchParams(search).get("redirect") || "";

  const { appDispatch, appState } = useAppContext();

  const { mutate: login, isLoading } = useMutation(
    (data) => fetcher({ url: "/login", method: "POST", data }),
    {
      onSuccess: (data) => {
        appDispatch(setAuth(data.data));

        Toast.show({
          content: "Login Berhasil",
          position: "bottom"
        });
      },
      onError: (error: Response<Login>) => {
        Toast.show({
          content: error.message,
          position: "bottom"
        });
      }
    }
  );

  useEffect(() => {
    if (appState.token) {
      navigate((redirect as string) || "/");
    }
  }, [appState.token, navigate, redirect]);

  return (
    <Layout title="Login" navBarProps={{ backURL: "/" }}>
      <Space direction="vertical" style={{ display: "flex" }}>
        <AutoCenter style={{ padding: 16 }}>
          Masuk untuk nikmati mudahnya pembayaran Mata Air dan akses ke fitur
          lainnya!
        </AutoCenter>
        <Form
          mode="card"
          requiredMarkStyle="none"
          onFinish={login}
          footer={
            <Space
              direction="vertical"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button block type="submit" color="primary" loading={isLoading}>
                Login
              </Button>
            </Space>
          }
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", required: true }]}
          >
            <Input placeholder="Email Anda" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input placeholder="Password Anda" type="password" />
          </Form.Item>
        </Form>

        <AutoCenter>
          <Button
            color="default"
            onClick={() => {
              shell.openExternal(
                "https://mataair-app.orbitallabs.net/desktop-login/"
              );
            }}
          >
            <Space style={{ display: "flex", alignItems: "center" }}>
              <img
                src={googleIcon}
                alt="Google Icon"
                style={{ width: 24, height: 24 }}
              />
              <span>Login dengan Google</span>
            </Space>
          </Button>
        </AutoCenter>

        <AutoCenter>
          Lupa password? <Link to="/forgot-password">Klik disini</Link>
        </AutoCenter>

        <Divider />
        <AutoCenter>
          Belum punya akun? Klik{" "}
          <Link
            to="#"
            onClick={() =>
              shell.openExternal(
                "https://mataair-app.orbitallabs.net/register?redirect=desktop-login"
              )
            }
          >
            Daftar melalui website
          </Link>{" "}
          disini
        </AutoCenter>
      </Space>
    </Layout>
  );
}
