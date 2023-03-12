import React, { useState, useEffect, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetcher } from "@/utils/fetcher";
import DownloadApp from "@/components/download-app";
import Layout from "@/components/layout";
import InfiniteScroll from "@/components/infinite-scroll";
import type { Magazine } from "@/types";

import Image from "@/components/image";
import { Link } from "react-router-dom";

export const NAVIGATION_KEYS = {
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  ENTER: "Enter"
};

const MagazineGrid = () => {
  const fetch = async ({ page, title }: { page: number; title?: string }) => {
    const { data, meta } = await fetcher<Magazine[]>({
      url: "/mobile/v1/magazines",
      params: { page, title }
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
    ["magazines"],
    ({ pageParam = 1 }) => fetch({ page: pageParam }),
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
      const firstElement = String(list?.[0]?.id);
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
    <Layout noNavBar>
      <div className="grid-container">
        {list?.map((el, idx) => (
          <Link
            key={`${el?.id} + ${idx}`}
            to={`/magazine/${el?.id}`}
            id={String(el?.id)}
            className={selected === el?.id ? "selected" : ""}
          >
            <Image
              src={el?.cover_url}
              width={160}
              height={200}
              style={{ borderRadius: 8 }}
            />
            {el?.title}
          </Link>
        ))}
      </div>
      <InfiniteScroll
        hasMore={hasMore || false}
        loadMore={loadMore}
        loading={isLoading || isFetching}
      />
      <DownloadApp />
    </Layout>
  );
};

export default MagazineGrid;
