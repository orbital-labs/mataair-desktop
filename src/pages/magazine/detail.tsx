import DownloadApp from "@/components/download-app";
import Image from "@/components/image";
import Layout from "@/components/layout";
import { Magazine } from "@/types";
import fetcher from "@/utils/fetcher";
import { sanitize } from "@/utils/string";
import { useQuery } from "@tanstack/react-query";
import { Button, Divider, Skeleton, Space, Toast } from "antd-mobile";
import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "@/contexts";

const MagazineDetail = () => {
  const { id } = useParams();
  const { appState } = useAppContext();
  const { user } = appState;
  const isSubs = useMemo(
    () => appState?.user?.active_subscription_id,
    [appState?.user]
  );

  const { data, isLoading } = useQuery(["magazine", id, user?.id], () =>
    fetcher<Magazine>({ url: `/mobile/v1/magazines/${id}` })
  );

  const handleShare = () => {
    // copy text to clipboard
    navigator.clipboard.writeText(
      `Baca majalah ${data?.data?.title} di Aplikasi Majalah Mataair`
    );
    Toast.show("Tautan telah disalin ke papan klip");
  };

  if (isLoading) {
    return (
      <Layout title="Majalah" style={{ padding: 16 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <Skeleton animated style={{ width: 240, height: 320 }} />
          <div>
            <Skeleton animated style={{ width: 320, height: 40 }} />
            <Skeleton.Paragraph animated />
          </div>
        </div>
        <Skeleton.Title animated />
        <Skeleton.Paragraph animated />
      </Layout>
    );
  }

  return (
    <Layout title={data?.data?.title}>
      <div style={{ padding: 16, display: "flex", gap: 8 }}>
        <Image
          scale={0.5}
          src={data?.data?.cover_url}
          style={{
            width: 240,
            height: 300,
            objectFit: "cover",
            borderRadius: 8
          }}
        />

        <Space direction="vertical">
          <div style={{ fontSize: 24, fontWeight: "bold" }}>
            {data?.data?.title}
          </div>
          <div>
            Majalah
            {" - "}
            {data?.data?.page_number
              ? data?.data?.page_number + " halaman"
              : ""}
          </div>
          <Button fill="none" onClick={handleShare}>
            Bagikan
          </Button>
          <Space>
            <Link
              to={{
                pathname: "/magazine/reader",
                search: `?id=${data?.data?.id}&title=${data?.data?.title}&sample=true`
              }}
              target="_blank"
            >
              <Button color="primary" fill="outline">
                Baca Sampel
              </Button>
            </Link>
            <Link
              to={{
                pathname: "/magazine/reader",
                search: `?id=${data?.data?.id}&title=${data?.data?.title}`
              }}
              target="_blank"
            >
              <Button disabled={!isSubs} color="primary">
                Baca Majalah
              </Button>
            </Link>
          </Space>
        </Space>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 18, fontWeight: "bold" }}>Deskripsi</div>
        <div style={{ fontSize: 16 }}>{sanitize(data?.data?.description)}</div>
      </div>
      <Divider />
      <DownloadApp />
    </Layout>
  );
};

export default MagazineDetail;
