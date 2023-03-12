import React from "react";
import type { InfiniteScrollProps as AntInfiniteScrollProps } from "antd-mobile";
import {
  DotLoading,
  ErrorBlock,
  InfiniteScroll as AntInfiniteScroll,
  Space
} from "antd-mobile";

type InfiniteScrollContentProps = {
  loading?: boolean;
  empty?: boolean;
  emptyDescription?: string;
};

type InfiniteScrollProps = {
  loadMore: () => Promise<any>;
  hasMore: boolean;
} & InfiniteScrollContentProps &
  Omit<AntInfiniteScrollProps, "loadMore" | "hasMore">;

const InfiniteScrollContent = ({
  loading,
  empty,
  emptyDescription
}: InfiniteScrollContentProps) => {
  if (loading) {
    return (
      <Space>
        <span>Menunggu</span>
        <DotLoading />
      </Space>
    );
  }

  if (!loading && empty) {
    return (
      <ErrorBlock
        status="empty"
        title="Belum ada data"
        description={emptyDescription || "Silakan coba lagi"}
      />
    );
  }

  return <div>--- Sudah dimuat semua ---</div>;
};

export default function InfiniteScroll(props: InfiniteScrollProps) {
  return (
    <AntInfiniteScroll
      loadMore={() => props.loadMore()}
      hasMore={props.hasMore}
    >
      <InfiniteScrollContent loading={props.loading} empty={props.empty} />
    </AntInfiniteScroll>
  );
}
