import React, { useMemo, useState } from "react";
import { SideBar as AntSidebar, SearchBar } from "antd-mobile";
import { useNavigate, useLocation } from "react-router-dom";
import NowPlaying from "../now-playing";

export default function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    {
      key: "/",
      title: "Beranda"
    },
    {
      key: "/playlist",
      title: "Jelajah"
    },
    {
      key: "/magazine",
      title: "Majalah"
    },
    {
      key: "/podcast",
      title: "Podcast"
    },
    {
      key: "/subscription",
      title: "Berlangganan"
    },
    {
      key: "/account",
      title: "Akun"
    }
  ];

  const activeKey = location.pathname.split("/")[1] || "";

  const handleChange = (key: string) => {
    window.scrollTo(0, 0);
    navigate(key);
  };

  const handleSearch = (value: string) => {
    navigate(`/search?q=${value}`);
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <>
      <SearchBar
        onCancel={handleCancel}
        onSearch={handleSearch}
        placeholder="Cari disini..."
      />
      <AntSidebar
        onChange={handleChange}
        activeKey={`/${activeKey}`}
        style={{ width: 240 }}
      >
        {tabs.map((item) => (
          <AntSidebar.Item tabIndex={0} key={item.key} title={item.title} />
        ))}
      </AntSidebar>
      <NowPlaying />
    </>
  );
}
