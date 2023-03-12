export type Magazine = {
  id?: string | number;
  title: string;
  description: string;
  preview_url?: string;
  magazine_url?: string;
  cover_url: string;
  page_number: number;
  release_date: Date | string;
};
