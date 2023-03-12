export const IMAGE_PROXY_URL = "https://image.orbitallabs.net";
export const IMAGE_CDN_URL = "https://d1nhzmcelkge58.cloudfront.net";

type ImageConfig = {
  width?: number;
  height?: number;
  scale?: number;
};

export function getImageUrl(url?: string, config?: ImageConfig) {
  const { width, height, scale } = config || {};

  if (scale)
    return encodeURI(`${IMAGE_PROXY_URL}/x${scale}/${IMAGE_CDN_URL}/${url}`);

  if (!width || !height) return encodeURI(`${IMAGE_CDN_URL}/${url}`);

  const size = `${width}x${height}`;
  return encodeURI(`${IMAGE_PROXY_URL}/${size}/${IMAGE_CDN_URL}/${url}`);
}

export default getImageUrl;
