import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import "dayjs/locale/id";

dayjs.locale("id");

export const formatDate = (date?: string | Date, format = "DD MMMM YYYY") => {
  return dayjs(date).format(format);
};

export const relativeTimeFormat = (date?: string | Date) => {
  if (!date) return "";
  dayjs.extend(relativeTime);
  if (dayjs().diff(dayjs(date), "month") > 1) return formatDate(date);

  return dayjs(date).fromNow();
};

// format second to minute second
export const formatSecond = (second?: number) => {
  if (!second) return "";
  if (second < 0) return "0d";
  if (second < 60) return `${second}d`;

  const minute = Math.floor(second / 60);
  const secondLeft = second % 60;
  return `${minute}m ${secondLeft}d`;
};

export const addLeadingZero = (number: number) => {
  return number < 10 ? `0${number.toFixed(0)}` : number.toFixed(0);
};

export const formatTimeSecond = (second?: number) => {
  if (!second) return "00:00";
  if (second < 0) return "00:00";
  if (second < 60) return `00:${addLeadingZero(second)}`;

  const minute = Math.floor(second / 60);
  const secondLeft = second % 60;
  return `${addLeadingZero(minute)}:${addLeadingZero(secondLeft)}`;
};

export default dayjs;
