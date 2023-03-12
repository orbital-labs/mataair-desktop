import React from "react";
import Banner from "@/components/banner";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/utils/fetcher";
import type { Banner as BannerType } from "@/types/banner";
import type { Magazine } from "@/types/magazine";
import type { Podcast } from "@/types/podcast";
import { Divider } from "antd-mobile";
import Highlight from "@/components/higlight";
import DownloadApp from "@/components/download-app";
import Layout from "@/components/layout";

const Home = () => {
  const { data: banners, isLoading: bannersLoading } = useQuery(
    ["home_banners"],
    () =>
      fetcher<BannerType[]>({
        url: "/mobile/v1/banners"
      })
  );
  const { data: magazines, isLoading: magazinesLoading } = useQuery(
    ["home_magazines"],
    () =>
      fetcher<Magazine[]>({
        url: "/mobile/v1/magazines"
      })
  );
  const { data: podcasts, isLoading: podcastsLoading } = useQuery(
    ["home_podcasts"],
    () =>
      fetcher<Podcast[]>({
        url: "/mobile/v1/podcasts"
      })
  );

  return (
    <Layout noNavBar navBarProps={{ back: null }} style={{ paddingBottom: 80 }}>
      <Banner data={banners?.data} loading={bannersLoading} />
      <Divider />
      <Highlight
        title="Majalah Terbaru"
        data={magazines?.data?.map((magazine) => ({
          image: magazine.cover_url,
          title: magazine.title,
          link: `/magazine/${magazine.id}`
        }))}
        loading={magazinesLoading}
        hasMoreHref="/magazine"
      />
      <Highlight
        imgWidth={160}
        imgHeight={160}
        title="Potcast Terbaru"
        data={podcasts?.data?.map((podcast) => ({
          image: podcast.poster_url,
          title: podcast.title,
          link: `/podcast/${podcast.id}`
        }))}
        hasMoreHref="/podcast"
        loading={podcastsLoading}
      />
      <DownloadApp />
    </Layout>
  );
};

export default Home;
