import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/utils/fetcher";
import Highlight from "@/components/higlight";
import DownloadApp from "@/components/download-app";
import Layout from "@/components/layout";
import { capitalize } from "@/utils/string";

export type Medium = {
  media_id: number;
  media_type: string;
  media_title: string;
  media_poster: string;
};

export type Playlist = {
  id: number;
  name: string;
  order: number;
  media: Medium[];
};

const Explore = () => {
  const { data } = useQuery(["playlists"], () =>
    fetcher<Playlist[]>({ url: "/mobile/v1/playlists" })
  );

  return (
    <Layout noNavBar>
      {data?.data?.length ? (
        data.data.map((playlist, idx) => (
          <Highlight
            key={idx}
            title={playlist.name}
            hasMoreHref={`/explore/${playlist.id}`}
            data={playlist.media.map((el) => ({
              link: `/${el.media_type}/${el.media_id}`,
              id: el.media_id,
              title: el.media_title,
              image: el.media_poster,
              subtitle: capitalize(el.media_type)
            }))}
          />
        ))
      ) : (
        <div style={{ textAlign: "center" }}>Tidak ada data</div>
      )}
      <DownloadApp />
    </Layout>
  );
};

export default Explore;
