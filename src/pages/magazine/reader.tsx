import React, { useMemo } from "react";
import DownloadApp from "@/components/download-app";
import Layout from "@/components/layout";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getFileUrl } from "@/utils/file";
import fetcher from "@/utils/fetcher";
import { Magazine } from "@/types";
import { useAppContext } from "@/contexts";

const MagazineReader = () => {
  const { appState } = useAppContext();
  const { user } = appState;
  const { search } = useLocation();
  const id = new URLSearchParams(search).get("id");
  const page = new URLSearchParams(search).get("page");
  const title = new URLSearchParams(search).get("title");
  const sample = new URLSearchParams(search).get("sample");

  const { data, isLoading } = useQuery(["magazine", id, user?.id], () =>
    fetcher<Magazine>({ url: `/mobile/v1/magazines/${id}` })
  );

  const url = useMemo(() => {
    let pdf = data?.data?.magazine_url;
    if (sample) {
      pdf = data?.data?.preview_url;
    }
    if (!pdf) return "";
    const noToolbar = "#toolbar=0";
    const pageURL = `&page=${page}`;
    return getFileUrl(pdf) + noToolbar + pageURL;
  }, [page, data]);

  return (
    <Layout
      title={title || "Baca Majalah"}
      navBarProps={{ right: <DownloadApp title="" /> }}
    >
      <div
        style={{
          height: "calc(100vh - 45px)",
          overflowY: "hidden",
          overflowX: "hidden"
        }}
      >
        {/* {JSON.stringify({ url, page, title })} */}
        <object data={url} type="application/pdf" width="100%" height="100%" />
      </div>
    </Layout>
  );
};

export default MagazineReader;
