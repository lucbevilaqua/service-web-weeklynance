import { FinanceSheets } from '@/app/api/finance/_models/finances'
import { useQuery } from '@tanstack/react-query'

function getEventsRequestFn() {
  return fetch("/api/finance")
    .then(res => res.json())
    .then(res => res.data)
}

export default function useGetEvents() {
  return useQuery<FinanceSheets[]>({
    queryKey: ['getEvents'],
    queryFn: getEventsRequestFn
  })
}
