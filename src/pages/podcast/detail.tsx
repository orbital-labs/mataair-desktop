import DownloadApp from "@/components/download-app";
import Image from "@/components/image";
import Layout from "@/components/layout";
import { useAppContext } from "@/contexts";
import { resetPlaylist, addPlaylist } from "@/contexts/appAction";
import { Podcast } from "@/types";
import { formatTimeSecond } from "@/utils/dayjs";
import fetcher from "@/utils/fetcher";
import { getFileUrl } from "@/utils/file";
import { sanitize } from "@/utils/string";
import { useQuery } from "@tanstack/react-query";
import { Button, Divider, Space, Toast, Skeleton } from "antd-mobile";
import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

const PodcastDetail = () => {
  const { appDispatch, appState } = useAppContext();
  const { user } = appState;
  const isSubs = useMemo(
    () => appState?.user?.active_subscription_id,
    [appState?.user]
  );

  const { id } = useParams();

  const { data, isLoading } = useQuery(["podcast", id, user?.id], () =>
    fetcher<Podcast>({ url: `/mobile/v1/podcasts/${id}` })
  );

  const handleShare = () => {
    navigator.clipboard.writeText(
      `Dengarkan podcast ${data?.data?.title} di Aplikasi Majalah Mataair`
    );
    Toast.show("Tautan telah disalin ke papan klip");
  };

  const handlePlaySample = () => {
    appDispatch(resetPlaylist());
    appDispatch(
      addPlaylist({
        id: String(data?.data?.id),
        title: data?.data?.title,
        src: getFileUrl(data?.data?.preview_url),
        duration: data?.data?.duration
      })
    );
  };

  const handlePlayFull = () => {
    appDispatch(resetPlaylist());
    appDispatch(
      addPlaylist({
        id: String(data?.data?.id),
        title: data?.data?.title,
        src: getFileUrl(data?.data?.media_url),
        duration: data?.data?.duration
      })
    );
  };

  if (isLoading) {
    return (
      <Layout title="Majalah" style={{ padding: 16 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <Skeleton animated style={{ width: 240, height: 240 }} />
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
          src={data?.data?.poster_url}
          style={{
            width: 240,
            height: 240,
            objectFit: "cover",
            borderRadius: 8
          }}
        />

        <Space direction="vertical">
          <div style={{ fontSize: 24, fontWeight: "bold" }}>
            {data?.data?.title}
          </div>
          <div>
            Podcast
            {" - "}
            {formatTimeSecond(data?.data?.duration)}
          </div>
          <Button fill="none" onClick={handleShare}>
            Bagikan
          </Button>
          <Space>
            <Button color="primary" fill="outline" onClick={handlePlaySample}>
              Putar Sampel
            </Button>
            <Button disabled={!isSubs} color="primary" onClick={handlePlayFull}>
              Putar
            </Button>
          </Space>
        </Space>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 18, fontWeight: "bold" }}>Deskripsi</div>
        <div
          style={{ fontSize: 16 }}
          dangerouslySetInnerHTML={{ __html: data?.data?.description ?? "" }}
        ></div>
        {isSubs && data?.data?.magazine_id && (
          <>
            <Space style={{ alignItems: "center" }}>
              <div style={{ fontSize: 18, fontWeight: "bold" }}>Majalah</div>
              <Link
                to={{
                  pathname: "/magazine/reader",
                  search: `?id=${data?.data?.magazine_id}&title=${data?.data?.title}&page=${data?.data?.page}`
                }}
                target="_blank"
              >
                <Button size="mini" color="primary" fill="outline">
                  Buka Majalah
                </Button>
              </Link>
            </Space>
            <div style={{ fontSize: 16 }}>
              {data?.data?.magazine?.title}
              {" - Halaman "}
              {data?.data?.page}
            </div>
          </>
        )}
      </div>
      <Divider />
      <DownloadApp />
    </Layout>
  );
};

export default PodcastDetail;
