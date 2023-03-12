import React, { useState, useEffect, useMemo } from "react";
import { CapsuleTabs } from "antd-mobile";
import { Link, useLocation } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetcher } from "@/utils/fetcher";
import Layout from "@/components/layout";
import { Medium } from "../playlist";
import Image from "@/components/image";
import InfiniteScroll from "@/components/infinite-scroll";

export const NAVIGATION_KEYS = {
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  ENTER: "Enter"
};

export default function Search() {
  const { search } = useLocation();
  const keyword = new URLSearchParams(search).get("q") || "";
  const [type, setType] = useState("");

  const fetch = async ({
    page,
    title,
    keyword,
    type
  }: {
    page: number;
    title?: string;
    keyword: string;
    type: string;
  }) => {
    const { data, meta } = await fetcher<Medium[]>({
      url: "/mobile/v1/search",
      params: { page, title, keyword, type }
    });

    const { total, limit } = meta ?? { total: 0, limit: 10 };

    return {
      data: page === null ? [] : data,
      nextPage: page + 1,
      totalPages: Math.ceil(total / limit)
    };
  };

  const {
    data,
    hasNextPage: hasMore,
    fetchNextPage: loadMore,
    isLoading,
    isFetching
  } = useInfiniteQuery(
    ["search", keyword, type],
    ({ pageParam = 1 }) => fetch({ page: pageParam, keyword, type }),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.nextPage <= lastPage.totalPages) return lastPage.nextPage;
        return undefined;
      }
    }
  );
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const list = useMemo(() => data?.pages?.flatMap((el) => el.data), [data]);

  const handleKeyPress = (e: KeyboardEvent) => {
    if (!list) return;
    if (!selected) {
      const firstElement = String(list?.[0]?.media_id);
      setSelected(firstElement);
      return;
    }

    if (e.key === NAVIGATION_KEYS.ARROW_RIGHT) {
      const element = document.getElementById(selected);
      const nextSibling = element?.nextSibling as HTMLDivElement;

      setSelected(nextSibling?.id);
    } else if (e.key === NAVIGATION_KEYS.ARROW_LEFT) {
      const element = document.getElementById(selected);
      const previousSibling = element?.previousSibling as HTMLDivElement;
      setSelected(previousSibling?.id);
    } else if (e.key === NAVIGATION_KEYS.ENTER) {
      const element = document.getElementById(selected);
      element?.click();
    }
  };

  const clearSelected = () => {
    if (selected) setSelected(undefined);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("mousemove", clearSelected);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("mousemove", clearSelected);
    };
  }, [selected, list]);

  return (
    <Layout title={`Hasil Pencarian "${keyword}"`}>
      <CapsuleTabs defaultActiveKey="" onChange={setType}>
        <CapsuleTabs.Tab tabIndex={0} title="Semua" key="" />
        <CapsuleTabs.Tab tabIndex={0} title="Majalah" key="magazine" />
        <CapsuleTabs.Tab tabIndex={0} title="Podcast" key="podcast" />
        <CapsuleTabs.Tab tabIndex={0} title="Playlist" key="playlist" />
      </CapsuleTabs>
      <div className="grid-container">
        {list?.map((el, idx) => (
          <Link
            key={`${el?.media_id} + ${idx}`}
            to={`/${el?.media_type}/${el?.media_id}`}
            id={String(el?.media_id)}
            className={selected === String(el?.media_id) ? "selected" : ""}
          >
            <Image
              src={el?.media_poster}
              width={160}
              height={200}
              style={{ borderRadius: 8 }}
            />
            {el?.media_title}
          </Link>
        ))}
      </div>
      <InfiniteScroll
        hasMore={hasMore || false}
        loadMore={loadMore}
        loading={isLoading || isFetching}
      />
    </Layout>
  );
}
