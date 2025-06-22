export type Extra = {
  name: string;
  splitOption: "others" | "home";
  amount: number;
};

export type Resume = {
  myAmount: number;
  others: number;
  house: number;
};

export type Finance = {
  id: string;
  currency: string;
  amount: number;
  date: string;
  category: string;
  establishment: string;
  extras: Extra[] | null;
  resume: Resume;
  createdAt: string;
};

export interface FinanceSheets extends Finance {
  rowNumber: number;
};
