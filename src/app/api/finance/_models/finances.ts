export type Extra = {
  name: string;
  value: number;
};

export type Finance = {
  id: number;
  currency: string;
  amount: number;
  week: string;
  category: string;
  establishment: string;
  splitOption: "mine" | "others" | "home";
  extras: Extra[] | null;
  myAmount: number;
  homeOrOtherAmount: number;
  created_at: string;
};

export type FinanceDb = {
  id: number;
  currency: string;
  amount: number;
  week: string;
  category: string;
  establishment: string;
  splitOption: "mine" | "others" | "home";
  extras: string | null;
  myAmount: number;
  homeOrOtherAmount: number;
  created_at: string;
};
