/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FinanceFormValues, FinanceSchema } from "@/lib/zod/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ExtraItemsList from "@/components/ExtraItemsList";
import { toast } from "sonner";

interface EventModalProps {
  date: Date;
  onSave: () => void;
}

export default function FinancesForm({ date, onSave }: EventModalProps) {
  const dateFormated = new Intl.DateTimeFormat("en-US").format(date);

  const methods = useForm<FinanceFormValues>({
    resolver: zodResolver(FinanceSchema),
    defaultValues: {
      currency: "EUR",
      category: "market",
      date: dateFormated,
      extras: []
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: FinanceFormValues) => {
    try {
      const response = await fetch("/api/finance/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to submit");
      }

      toast.success("Finance entry saved successfully!");
      reset({
        currency: 'EUR',
        amount: undefined,
        category: 'market',
        establishment: "",
        extras: [],
      });
      onSave();
    } catch (error: any) {
      toast.error(`Error saving entry: ${error.message}`);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="font-medium">Currency</label>
          <select {...register("currency")} className="w-full p-2 border rounded-md mt-1">
            <option value="EUR">Euro (€)</option>
            <option value="BRL">Real (R$)</option>
            <option value="GBP">Pound (£)</option>
          </select>
        </div>

        <div>
          <label className="font-medium">Amount</label>
          <Input
            type="number"
            step="0.01"
            {...register("amount", { valueAsNumber: true })}
            placeholder="Enter amount"
          />
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
        </div>

        <div>
          <label className="font-medium">Category</label>
          <select {...register("category")} className="w-full p-2 border rounded-md mt-1">
            <option value="market">Market</option>
            <option value="bar">Bar</option>
            <option value="toy">Toys</option>
            <option value="coffee">Coffee Time</option>
            <option value="transport_internet">Transport/Internet</option>
          </select>
        </div>

        <div>
          <label className="font-medium">Establishment</label>
          <Input {...register("establishment")} placeholder="e.g., Lidl, Starbucks..." />
        </div>

        <ExtraItemsList />

        <Button type="submit" className="w-full mt-4">Submit</Button>
      </form>
    </FormProvider>
  );
}
