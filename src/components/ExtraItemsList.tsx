"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ExtraItemsList() {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "extras",
  });

  return (
    <div className="space-y-4 mt-4">
      <p className="font-medium">Additional Items</p>
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <Input
            {...register(`extras.${index}.name`)}
            placeholder="Name"
            className="w-1/2"
          />
          <Input
            {...register(`extras.${index}.amount`, { valueAsNumber: true })}
            placeholder="Amount"
            type="number"
            step="0.01"
            className="w-1/2"
          />
          <Button
            type="button"
            variant="destructive"
            onClick={() => remove(index)}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button type="button" onClick={() => append({ name: "", amount: 0 })}>
        Add Item
      </Button>
    </div>
  );
}
