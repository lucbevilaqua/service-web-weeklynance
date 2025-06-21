import { z } from "zod";

export const financeSchema = z.object({
  currency: z.enum(["EUR", "BRL", "GBP"]),
  amount: z.coerce.number().positive("The value must be a positive number."),
  week: z.enum(["week1", "week2", "week3", "week4"]),
  category: z.enum([
    "market",
    "bar",
    "toy",
    "coffee",
    "transport_internet",
  ]),
  establishment: z.string().min(1, "Please provide the establishment name."),
  splitOption: z.enum(["mine", "others", "home"]),
  extras: z
    .array(
      z.object({
        name: z.string().min(1, "Please enter a name."),
        value: z.coerce.number().positive("Value must be positive."),
      })
    )
    .optional()
});

export type FinanceFormValues = z.infer<typeof financeSchema>;
