import { User } from "./user";

export type Invoice = {
  id: number;
  subscription_name: string;
  invoice_code: string;
  ammount: number;
  bank_name: string;
  bank_account: string;
  bank_number: string;
  proof_of_payment: string;
  status: string;
  status_updated_at?: string;
  qty: number;
  price: number;
  email: string;
  name: string;
  phone: string;
  item_details: string;
  user_id: number;
  user: User;
  item_id: number;
  item_type: string;
  item_name: string;
  midtrans_token: string;
  created_at: Date;
};
