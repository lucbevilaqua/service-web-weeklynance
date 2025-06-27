"use client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import FinancesForm from "./FinancesForm"
import { PlusIcon } from "lucide-react"
import useGetEvents from "@/services/finances/useGetEvents";
import { useState } from "react";

interface EventModalProps {
  date: Date;
}

export function EventModal({ date }: EventModalProps) {
  const { refetch } = useGetEvents()
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleSave = () => {
    setIsDialogOpen(false);
    refetch();
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <form>
        <DialogTrigger asChild >
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            title="Add Event"
          >
            <PlusIcon />
            <span className="sr-only">Add Event</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add event</DialogTitle>
          </DialogHeader>

          <FinancesForm date={date} onSave={handleSave} />

        </DialogContent>
      </form>
    </Dialog>
  )
}
