"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface TableRowI {
  id: number
  costname: string
  amount: number
  payedBy: number
  costSplitting: Map<number, number>
}

export interface Payer {
  id: number
  name: string
}

export const createColumns = (
  payers: Payer[],
  handleCostNameChange: (rowId: number, value: string) => void,
  handleAmountChange: (rowId: number, value: number) => void,
  handlePayerChange: (rowId: number, value: number) => void,
  handleCostSplittingChange: (rowId: number, payerId: number, value: number) => void
): ColumnDef<TableRowI>[] => [
  {
    accessorKey: "costname",
    header: "Name",
    cell: ({ row }) => (
      <Input
        type="text"
        placeholder="Cost Name"
        value={row.original.costname}
        onChange={(e) => handleCostNameChange(row.original.id, e.target.value)}
        data-row-id={row.original.id}
      />
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <Input
        type="number"
        placeholder="Amount"
        value={row.original.amount}
        onChange={(e) => handleAmountChange(row.original.id, Number(e.target.value))}
        className="text-right"
      />
    ),
  },
  {
    accessorKey: "payedBy",
    header: "Payed By",
    cell: ({ row }) => (
      <Select
        value={String(row.original.payedBy)}
        onValueChange={(value) => handlePayerChange(row.original.id, Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a payer" />
        </SelectTrigger>
        <SelectContent>
          {payers.map((payer) => (
            <SelectItem key={payer.id} value={String(payer.id)}>
              {payer.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
  },
  ...payers.map((payer) => ({
    id: `split-${payer.id}`,
    header: () => (
      <Input
        type="text"
        placeholder="Payer Name"
        value={payer.name}
        data-payer-id={payer.id}
        className="w-32"
        readOnly
      />
    ),
    cell: ({ row }) => (
      <div className="relative flex justify-center">
        <Input
          type="number"
          placeholder="Share"
          value={row.original.costSplitting.get(payer.id)}
          onChange={(e) => handleCostSplittingChange(row.original.id, payer.id, Number(e.target.value))}
          className="pr-6 w-20"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2">%</span>
      </div>
    ),
  })),
] 