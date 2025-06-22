import { z } from "zod";

export const FinanceSchema = z.object({
  currency: z.enum(["EUR", "BRL", "GBP"]),
  amount: z.coerce.number().positive("The value must be a positive number."),
  date: z.string(),
  category: z.enum([
    "market",
    "bar",
    "toy",
    "coffee",
    "transport_internet",
  ]),
  establishment: z.string().min(1, "Please provide the establishment name."),
  extras: z
    .array(
      z.object({
        name: z.string().min(1, "Please enter a name."),
        splitOption: z.enum(["others", "home"]),
        amount: z.coerce.number().positive("Value must be positive."),
      })
    )
    .optional()
});

export type FinanceFormValues = z.infer<typeof FinanceSchema>;
