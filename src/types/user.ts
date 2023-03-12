export type User = {
  id: string;
  email: string;
  username: string;
  name: string;
  is_admin: boolean;
  active_subscription: boolean;
  active_subscription_id: number;
  password: string;
  is_verified: boolean;
};
