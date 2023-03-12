export const capitalize = (str?: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const sanitize = (str?: string) => {
  if (!str) return "";
  return str.replace(/<\/?[^>]+(>|$)/g, "");
};
