export const getFileUrl = (file?: string) => {
  if (!file) return "";

  const CDN = "https://orbital-prd.s3.ap-southeast-1.amazonaws.com/";
  return encodeURI(CDN + file);
};
