export type PaymentMethod =
  | "card"
  | "vodafone_cash"
  | "mobile_wallet"
  | "apple_pay";

export interface PaymentPayload {
  userId: string;
  country: string;
  amount: number;
  currency: "EGP" | "USD";
  method: PaymentMethod;
  packageId: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  credits: number;
  amount: number;
  currency: "EGP" | "USD";
}