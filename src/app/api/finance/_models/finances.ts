export type Extra = {
  name: string;
  amount: number;
};

export type Finance = {
  id: string;
  currency: string;
  amount: number;
  week: string;
  category: string;
  establishment: string;
  splitOption: "mine" | "others" | "home";
  extras: Extra[] | null;
  myAmount: number;
  homeOrOtherAmount: number;
  createdAt: string;
};

export interface FinanceSheets extends Finance {
  rowNumber: number;
};
