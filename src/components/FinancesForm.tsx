/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { financeSchema, FinanceFormValues } from "@/lib/form-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import WeekSelector from "@/components/WeekSelector";
import ExtraItemsList from "@/components/ExtraItemsList";
import { useState } from "react";
import { toast } from "sonner";

export default function FinancesForm() {
  const [week, setWeek] = useState("week1");

  const methods = useForm<FinanceFormValues>({
    resolver: zodResolver(financeSchema),
    defaultValues: {
      currency: "EUR",
      splitOption: "mine",
      week: "week1",
      extras: []
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  const selectedSplit = watch("splitOption");

  const onSubmit = async (data: FinanceFormValues) => {
    try {
      const response = await fetch("/api/finance", {
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
        currency: "EUR",
        splitOption: "mine",
        week: "week1",
        amount: undefined,
        category: undefined,
        establishment: "",
        extras: [],
      });
      setWeek("week1");
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

        <WeekSelector
          selectedWeek={week}
          onChange={(value: any) => {
            setValue("week", value);
            setWeek(value);
          }}
        />

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

        <div>
          <label className="font-medium">Split Option</label>
          <select {...register("splitOption")} className="w-full p-2 border rounded-md mt-1">
            <option value="mine">Just mine</option>
            <option value="others">Includes items for others</option>
            <option value="home">Includes house items</option>
          </select>
        </div>

        {selectedSplit !== "mine" && <ExtraItemsList />}

        <Button type="submit" className="w-full mt-4">Submit</Button>
      </form>
    </FormProvider>
  );
}
