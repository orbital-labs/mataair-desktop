import React, { useEffect } from "react";

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

import Layout from "@/components/layout";
import { setAuth, useAppContext } from "@/contexts/index";
import type { Login } from "@/types";
import fetcher, { Response } from "@/utils/fetcher";
import DownloadApp from "@/components/download-app";

export default function Subscription() {
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
      }
    }
  );

  const { mutate: googleLogin } = useMutation<
    Response<Login>,
    Response,
    { token: string }
  >((data) => fetcher({ url: "/google-auth", method: "POST", data }), {
    onSuccess: (data) => {
      if (data?.data) {
        appDispatch(setAuth(data?.data));

        Toast.show({
          content: "Login Berhasil",
          position: "bottom"
        });
      }
    }
  });

  return (
    <Layout title="Berlangganan">
      <Space direction="vertical" style={{ gap: 16, paddingInline: 16 }}>
        <AutoCenter>
          <h2>Baca dan dengarkan artikel Majalah Mata Air secara digital</h2>
        </AutoCenter>
        <AutoCenter style={{ textAlign: "center" }}>
          Membaca Mata Air jauh lebih praktis dan mudah dengan adanya aplikasi
          Majalah Mata Air melalui smartphone Anda. Anda juga dapat mendengarkan
          podcast kami melalui smarthphone Anda. Baca dan dengarkan kapanpun dan
          dimanapun Anda berada.
        </AutoCenter>
        <DownloadApp />
        <AutoCenter style={{ textAlign: "center" }}>
          Untuk memulai pengalaman terbaik Anda bersama Majalah Mata Air,
          silakan berlangganan melalui tombol dibawah ini
        </AutoCenter>
        <AutoCenter style={{ textAlign: "center" }}>
          <Link
            to="https://mataair-app.orbitallabs.net/subscription/create"
            target={"_blank"}
          >
            <Button color="primary">BERLANGGANAN</Button>
          </Link>
        </AutoCenter>
      </Space>
    </Layout>
  );
}
