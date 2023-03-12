import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/utils/fetcher";
import DownloadApp from "@/components/download-app";
import Layout from "@/components/layout";

import Image from "@/components/image";
import { Link, useParams } from "react-router-dom";
import { Playlist } from ".";
import { capitalize } from "@/utils/string";

const ExploreGrid = () => {
  const { id } = useParams() as { id: string };

  const { data } = useQuery(["playlist", id], () =>
    fetcher<Playlist>({ url: `/mobile/v1/playlists/${id}` })
  );

  return (
    <Layout title={data?.data?.name || "Jelajah"}>
      <div
        style={{
          padding: 16,
          display: "grid",
          gridGap: 16,
          gridTemplateColumns: "repeat(auto-fill, 160px)"
        }}
      >
        {data?.data?.media?.map((el, idx) => (
          <Link
            to={`/${el.media_type}/${el.media_id}`}
            key={`${el?.media_id} + ${idx}`}
          >
            <Image
              src={el?.media_poster}
              width={160}
              height={200}
              style={{ borderRadius: 8, objectFit: "cover" }}
            />
            <div>{el?.media_title}</div>
            <div>{capitalize(el?.media_type)}</div>
          </Link>
        ))}
      </div>

      <DownloadApp />
    </Layout>
  );
};

export default ExploreGrid;
