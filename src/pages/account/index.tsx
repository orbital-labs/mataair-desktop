import React, { useMemo } from "react";
import { Avatar, List, Modal } from "antd-mobile";
import { useNavigate } from "react-router-dom";

import DownloadApp from "@/components/download-app";
import Layout from "@/components/layout";
import { logout, useAppContext } from "@/contexts/index";
import { useQuery } from "@tanstack/react-query";
import fetcher from "@/utils/fetcher";
import { Subscription } from "@/types";
import { formatDate } from "@/utils/dayjs";

export default function Profile() {
  const navigate = useNavigate();
  const { appState, appDispatch } = useAppContext();
  const { user } = appState;
  const isSubs = useMemo(
    () => appState?.user?.active_subscription_id,
    [appState?.user]
  );

  const { data: subscription } = useQuery(["subscription"], () =>
    fetcher<Subscription>({
      url: `/mobile/v1/subscriptions/${user?.active_subscription_id}`
    })
  );

  const handleLogout = () => {
    Modal.confirm({
      content: "Apakah Anda yakin untuk logout",
      confirmText: "Ya",
      closeOnMaskClick: true,
      cancelText: "Tidak",
      onConfirm: () => {
        appDispatch(logout());
      }
    });
  };

  return (
    <>
      <Layout title="Profile">
        <List mode="card">
          {user ? (
            <List.Item description={user.email} prefix={<Avatar src="" />}>
              {user.name}
            </List.Item>
          ) : (
            <List.Item
              onClick={() => navigate("/login")}
              description="Silakan masuk untuk menikmati fitur lainnya"
              prefix={<Avatar src="" />}
            >
              <span className="font-bold">Masuk/Register</span>
            </List.Item>
          )}
        </List>
        {user && (
          <List mode="card" header="Berlangganan">
            <List.Item extra={isSubs ? "Berlangganan " : "Tidak berlangganan"}>
              Status berlangganan
            </List.Item>
            {isSubs && (
              <>
                <List.Item
                  extra={formatDate(subscription?.data?.subscription_start)}
                >
                  Mulai berlangganan
                </List.Item>
                <List.Item
                  extra={formatDate(subscription?.data?.subscription_end)}
                >
                  Berlangganan hingga
                </List.Item>
                <List.Item
                  onClick={() => {
                    Modal.show({
                      closeOnMaskClick: true,
                      closeOnAction: true,
                      actions: [{ key: "close", primary: true, text: "Tutup" }],
                      content: (
                        <div style={{ textAlign: "center" }}>
                          {"Silakan buka aplikasi Mataair"} <br />
                          {"untuk melihat detail berlangganan Anda"}
                        </div>
                      )
                    });
                  }}
                >
                  Info Lainnya
                </List.Item>
              </>
            )}
          </List>
        )}
        <List mode="card" header="Aplikasi">
          <List.Item
            onClick={() => {
              window.open("https://mataair.co/faq", "_blank");
            }}
          >
            FAQ
          </List.Item>
          <List.Item
            onClick={() => {
              window.open("https://mataair.co/privacy-policy/", "_blank");
            }}
          >
            Kebijakan Privasi
          </List.Item>
          <List.Item extra="v 1.2.0">Tentang Aplikasi</List.Item>
        </List>
        {user && (
          <List mode="card">
            <List.Item onClick={handleLogout}>Keluar</List.Item>
          </List>
        )}
        <DownloadApp />
      </Layout>
    </>
  );
}
