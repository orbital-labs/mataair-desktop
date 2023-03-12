import React, { useEffect, useRef, useState } from "react";
import { Button, Ellipsis, Skeleton } from "antd-mobile";
import { Link } from "react-router-dom";

import Image from "@/components/image";

interface IHighlightItem {
  link: string;
  image?: string;
  title?: string;
  subtitle?: string;
}

interface IHighlight {
  title: string;
  data?: IHighlightItem[];
  imgWidth?: number;
  imgHeight?: number;
  hasMoreText?: string;
  hasMoreHref?: string;
  loading?: boolean;
}

const Highlight = ({
  title,
  data,
  hasMoreText = "Lihat Lainnya",
  imgWidth = 160,
  imgHeight = 200,
  hasMoreHref,
  loading
}: IHighlight) => {
  const highlightRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(
    highlightRef?.current?.scrollLeft || 0
  );
  const [scrollWidth, setScrollWidth] = useState(
    highlightRef?.current?.scrollWidth || 0
  );
  const [offsetWidth, setOffsetWidth] = useState(
    highlightRef?.current?.offsetWidth || 0
  );

  const handleScrollLeft = () => {
    if (highlightRef && highlightRef.current) {
      const next = highlightRef.current.scrollLeft - 150;
      highlightRef.current.scrollTo({ left: next, behavior: "smooth" });
      setScrollLeft(next);
    }
  };

  const handleScrollRight = () => {
    if (highlightRef && highlightRef.current) {
      const next = highlightRef.current.scrollLeft + 150;
      highlightRef.current.scrollTo({ left: next, behavior: "smooth" });
      setScrollLeft(next);
    }
  };

  const handleHighlightScroll = () => {
    setScrollLeft(highlightRef?.current?.scrollLeft || 0);
  };

  const handleWindowResize = () => {
    setOffsetWidth(highlightRef?.current?.offsetWidth || 0);
    setScrollWidth(highlightRef?.current?.scrollWidth || 0);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  useEffect(() => {
    if (highlightRef.current) {
      setScrollWidth(highlightRef?.current?.scrollWidth);
      setOffsetWidth(highlightRef?.current?.offsetWidth);
      setScrollLeft(highlightRef?.current?.scrollLeft);
    }
  }, [highlightRef.current, data]);

  return (
    <div className="highlight">
      <div className="title-wrapper">
        <div>{title}</div>
        {hasMoreHref && <Link to={hasMoreHref}>{hasMoreText}</Link>}
      </div>
      <div className="highlight-wrapper">
        <Button
          tabIndex={-1}
          shape="rounded"
          onClick={handleScrollLeft}
          className={
            scrollLeft <= 0 ? "left opacity-0" : "shadow left opacity-1"
          }
        >
          {"◄"}
        </Button>
        <Button
          tabIndex={-1}
          shape="rounded"
          onClick={handleScrollRight}
          className={
            offsetWidth + scrollLeft < scrollWidth && offsetWidth < scrollWidth
              ? "shadow right opacity-1"
              : "right opacity-0"
          }
        >
          {"►"}
        </Button>
        <div
          className="highlight-container pl-2 pr-2"
          ref={highlightRef}
          onScroll={handleHighlightScroll}
        >
          {loading ? (
            <>
              {[1, 2, 3].map((_, idx) => (
                <div
                  key={idx}
                  className="highlight-item"
                  style={{ width: imgWidth }}
                >
                  <div
                    className="highlight-item-img"
                    style={{
                      width: imgWidth,
                      height: imgHeight
                    }}
                  >
                    <Skeleton
                      animated
                      style={{ "--height": "100%", "--width": "100%" }}
                    />
                  </div>
                  <div className="highlight-item-text">
                    <Skeleton.Paragraph lineCount={1} />
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {data?.map((item, idx) => (
                <Link
                  className="highlight-item"
                  style={{ width: imgWidth }}
                  to={item.link}
                  key={`${idx}-${item.image}`}
                >
                  <div
                    className="highlight-item-img"
                    style={{
                      width: imgWidth,
                      height: imgHeight
                    }}
                  >
                    <Image
                      draggable={false}
                      alt="highlight"
                      src={item.image!}
                    />
                  </div>
                  {item.title && (
                    <div className="highlight-item-text">
                      <Ellipsis content={item.title} rows={2} />
                      <Ellipsis content={item.subtitle!} rows={4} />
                    </div>
                  )}
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Highlight;
