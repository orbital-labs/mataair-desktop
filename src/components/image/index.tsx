/* eslint-disable indent */
import getImageUrl from "@/utils/image";
import React, { ImgHTMLAttributes } from "react";

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src?: string;
  alt?: string;
  scale?: number;
  local?: boolean;
};

const Image = ({
  alt,
  src,
  local,
  scale,
  width,
  height,
  style,
  ...rest
}: ImageProps) => {
  const imageRef = React.useRef<HTMLImageElement>(null);
  const imageSrc =
    src && !local
      ? getImageUrl(src, {
          width: Number(width),
          height: Number(height),
          scale: scale
        })
      : src;

  const handleOnError = () => {
    if (imageRef.current) {
      imageRef.current.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    }
  };

  return (
    <img
      ref={imageRef}
      alt={alt || "image"}
      src={imageSrc}
      width={width}
      height={height}
      onError={handleOnError}
      {...rest}
      style={{ objectFit: "cover", backgroundColor: "#f3f3f3", ...style }}
    />
  );
};

export default Image;
