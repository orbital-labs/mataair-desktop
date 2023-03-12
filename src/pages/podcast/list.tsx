import React, { useState, useEffect, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetcher } from "@/utils/fetcher";
import DownloadApp from "@/components/download-app";
import Layout from "@/components/layout";
import InfiniteScroll from "@/components/infinite-scroll";
import type { Podcast } from "@/types";

import Image from "@/components/image";
import { relativeTimeFormat, formatTimeSecond } from "@/utils/dayjs";
import { Link } from "react-router-dom";

export const NAVIGATION_KEYS = {
  ARROW_DOWN: "ArrowDown",
  ARROW_UP: "ArrowUp",
  ENTER: "Enter"
};

const PodcastList = () => {
  const fetch = async ({ page, title }: { page: number; title?: string }) => {
    const { data, meta } = await fetcher<Podcast[]>({
      url: "/mobile/v1/podcasts",
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
    ["podcasts"],
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

    if (e.key === NAVIGATION_KEYS.ARROW_DOWN) {
      const element = document.getElementById(selected);
      const nextSibling = element?.nextSibling as HTMLDivElement;

      setSelected(nextSibling?.id);
    } else if (e.key === NAVIGATION_KEYS.ARROW_UP) {
      const element = document.getElementById(selected);
      const previousSibling = element?.previousSibling as HTMLDivElement;
      setSelected(previousSibling?.id);
    } else if (e.key === NAVIGATION_KEYS.ENTER) {
      const element = document.getElementById(selected);
      element?.click();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [selected, list]);

  return (
    <Layout noNavBar>
      <div className="list-container">
        {list?.map((el, idx) => (
          <Link
            id={String(el?.id)}
            className={selected === el?.id ? "selected" : ""}
            to={`/podcast/${el?.id}`}
            key={`${el?.id} + ${idx}`}
          >
            <Image
              src={el?.poster_url}
              width={64}
              height={64}
              style={{ borderRadius: 8 }}
            />
            <div>
              <div style={{ fontWeight: "bold" }}>{el?.title}</div>
              <div>{relativeTimeFormat(el?.release_date)}</div>
              <div>{formatTimeSecond(el?.duration)}</div>
            </div>
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

export default PodcastList;
