import { Magazine } from "./magazine";

export type Podcast = {
  id?: string | number;
  title: string;
  description: string;
  preview_url?: string;
  media_url?: string;
  poster_url: string;
  duration: number;
  release_date: Date | string;
  magazine_id?: string;
  magazine?: Partial<Magazine>;
  page: number;
};
