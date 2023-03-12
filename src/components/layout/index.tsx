import React, { useEffect } from "react";

import type { NavBarProps } from "antd-mobile";
import { NavBar, SafeArea } from "antd-mobile";
import { useNavigation, useNavigate } from "react-router-dom";

import { getItem } from "@/utils/local-storage";

type LayoutProps = {
  children: React.ReactNode | React.ReactNode[];
  title?: string;
  protectedRoute?: boolean;
  noNavBar?: boolean;
  navBarProps?: NavBarProps & { backURL?: string };
  style?: React.CSSProperties;
};

export default function Layout({
  children,
  title,
  protectedRoute,
  navBarProps,
  noNavBar,
  style
}: LayoutProps) {
  const router = useNavigation();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = title ? `${title} - Majalah Mataair` : "Majalah Mataair";
  }, [title]);

  useEffect(() => {
    if (protectedRoute && !getItem("token")) {
      navigate({
        pathname: "/login",
        search: "?redirect=" + router.location?.pathname
      });
    }
  }, [protectedRoute, router]);

  return (
    <div className="container" style={style}>
      {!noNavBar && (
        <NavBar
          style={{ position: "sticky" }}
          onBack={() =>
            navBarProps?.backURL ? navigate(navBarProps?.backURL) : navigate(-1)
          }
          {...navBarProps}
        >
          {title || navBarProps?.children}
        </NavBar>
      )}
      <div>{children}</div>
      <div style={{ background: "#f7f7f7" }}>
        <SafeArea position="bottom" />
      </div>
    </div>
  );
}
