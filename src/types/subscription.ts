import { Invoice } from "./invoice";
import { User } from "./user";

export type Subscription = {
  id?: number;
  user_id?: number;
  user?: User;
  invoice: Invoice;
  full_name?: string;
  profession?: string;
  phone?: string;
  email?: string;
  known_from?: string;
  address_street?: string;
  address_province?: string;
  address_city?: string;
  address_district?: string;
  address_postal_code?: string;
  subscription_price?: number;
  subscription_start?: string;
  subscription_end?: string;
  is_active?: boolean;
  created_at?: Date;
  referral_id?: number;
  invoice_code?: string;
};
