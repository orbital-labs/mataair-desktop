import React from "react";
import { Skeleton, Swiper } from "antd-mobile";
import { Link } from "react-router-dom";
import Image from "../image";
import { getImageUrl } from "@/utils/image";

export type Banner = {
  banner_url?: string;
  description?: string;
  id?: number | string;
  slug?: string;
  title?: string;
  link?: string;
  link_text?: string;
  created_at?: Date;
  is_active?: boolean;
};

interface IBannerProps {
  data: Banner[] | undefined;
  loading?: boolean;
}

const Banner = ({ data, loading }: IBannerProps) => {
  if (loading) {
    return <Skeleton animated style={{ "--height": "240px" }} />;
  }

  return (
    <Swiper autoplay={true} loop={true}>
      {data?.length ? (
        data.map((banner, idx) => (
          <Swiper.Item key={`${idx}-${banner.id}`}>
            <Link to={banner.link!}>
              <div
                style={{
                  height: 400,
                  backgroundColor: "#f5f5f5",
                  background: `url(${getImageUrl(
                    banner.banner_url
                  )}) no-repeat fixed center / cover`
                }}
              >
                <div
                  style={{
                    backdropFilter: "blur(20px)",
                    width: "100%",
                    height: "100%"
                  }}
                >
                  <Image
                    draggable={false}
                    alt={banner.slug || "banner"}
                    src={banner.banner_url || ""}
                    width="100%"
                    height="100%"
                    style={{
                      objectFit: "contain",
                      background: "rgba(0, 0, 0, 0.25)"
                    }}
                  />
                </div>
              </div>
            </Link>
          </Swiper.Item>
        ))
      ) : (
        <></>
      )}
    </Swiper>
  );
};

export default Banner;
