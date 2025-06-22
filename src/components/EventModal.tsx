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

interface EventModalProps {
  date: Date;
  onSave: () => void
}

export function EventModal({ date, onSave }: EventModalProps) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
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

          <FinancesForm date={date} onSave={onSave} />

        </DialogContent>
      </form>
    </Dialog>
  )
}
