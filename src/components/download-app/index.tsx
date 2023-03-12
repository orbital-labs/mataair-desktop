import React from "react";
import { Space } from "antd-mobile";
import { Link } from "react-router-dom";

import Image from "../image";

import playStore from "@/assets/icons/ic-download-android.svg";
import appStore from "@/assets/icons/ic-download-ios.svg";

type DownloadAppProps = {
  title?: string | boolean;
};

export default function DownloadApp({
  title = "Untuk pengalaman lebih baik, silakan download aplikasi sekarang juga!"
}: DownloadAppProps) {
  return (
    <>
      {title !== false && <div style={{ textAlign: "center" }}>{title}</div>}
      <Space style={{ display: "flex", justifyContent: "center" }}>
        <Link
          target="_blank"
          to="https://play.google.com/store/apps/details?id=com.orbital.mataair"
        >
          <img
            width={125}
            height={37}
            alt="Download Android App"
            src={playStore}
          />
        </Link>
        <Link target="_blank" to="https://apps.apple.com/app/id1561475506">
          <Image
            local
            width={118}
            height={37}
            alt="Download iOS App"
            src={appStore}
          />
        </Link>
      </Space>
    </>
  );
}
