import { User } from "./user";

export type Login = {
  token: string;
  user: User;
  expire: Date;
};
