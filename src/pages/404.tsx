import React from "react";
import { AutoCenter, Button, ErrorBlock } from "antd-mobile";
import { Link } from "react-router-dom";

import Layout from "@/components/layout";

export default function NotFound() {
  return (
    <Layout noNavBar>
      <ErrorBlock
        status="empty"
        title="Anda sepertinya tersesat"
        description="Silakan kembali ke Beranda "
      />
      <AutoCenter>
        <Link to="/">
          <Button>Kembali ke Beranda</Button>
        </Link>
      </AutoCenter>
    </Layout>
  );
}
