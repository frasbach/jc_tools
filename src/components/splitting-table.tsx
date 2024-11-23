'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import { PlusCircleIcon } from "lucide-react"
import { SelectGroup } from '@/components/ui/select';

interface TableRow {
  id: number
  costname: string
  amount: number
  payedBy: number
  costSplitting: Map<number, number>
}

interface Payer {
  id: number
  name: string
}

const initialTableRows: TableRow[] = [
  {
    id: 1,
    costname: "Essen",
    amount: 100,
    payedBy: 1,
    costSplitting: new Map([
      [1, 100],
      [2, 0]
    ])
  },
  {
    id: 2,
    costname: "Getränk",
    amount: 50,
    payedBy: 2,
    costSplitting: new Map([
      [1, 0],
      [2, 50]
    ])
  }
];

const initialPayers: Payer[] = [
  {
    id: 1,
    name: "Max Mustermann"
  },
  {
    id: 2,
    name: "Felix Steiner"
  }
]

export default function SplittingTable() {
  const [tableRows, setTableRows] = useState<TableRow[]>(initialTableRows)
  const [payers, setPayers] = useState<Payer[]>(initialPayers)

  const handleCostNameChange = (rowId: number, newName: string) => {
    setTableRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId ? { ...row, costname: newName } : row
      )
    )
  }

  const handleAmountChange = (rowId: number, newAmount: string) => {
    const amount = parseFloat(newAmount) || 0
    setTableRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId ? { ...row, amount } : row
      )
    )
  }

  const handlePayerChange = (rowId: number, newPayerId: string) => {
    const payerId = parseInt(newPayerId)
    setTableRows(prevRows =>
      prevRows.map(row => {
        if (row.id === rowId) {
          // Reset cost splitting when payer changes
          const newCostSplitting = new Map(Array.from(row.costSplitting.entries()).map(([id, _]) => [id, 0]))
          newCostSplitting.set(payerId, row.amount)
          return { ...row, payedBy: payerId, costSplitting: newCostSplitting }
        }
        return row
      })
    )
  }

  const handleCostSplittingChange = (rowId: number, payerId: number, newAmount: string) => {
    const amount = parseFloat(newAmount) || 0
    setTableRows(prevRows =>
      prevRows.map(row => {
        if (row.id === rowId) {
          const newCostSplitting = new Map(row.costSplitting)
          newCostSplitting.set(payerId, amount)
          return { ...row, costSplitting: newCostSplitting }
        }
        return row
      })
    )
  }

  const handleAddRow = () => {
    // Get the highest existing ID and add 1
    const newId = Math.max(...tableRows.map(row => row.id), 0) + 1

    // Create cost splitting map for all existing payers
    const newCostSplitting = new Map(
      payers.map(payer => [payer.id, 0])
    )

    const newRow: TableRow = {
      id: newId,
      costname: "",
      amount: 0,
      payedBy: payers[0]?.id || 1, // Default to first payer
      costSplitting: newCostSplitting
    }

    setTableRows(prevRows => [...prevRows, newRow])

    // Set focus to the cost name input of the new row
    setTimeout(() => {
      const newRowInput = document.querySelector(`input[data-row-id="${newId}"]`)
      if (newRowInput instanceof HTMLInputElement) {
        newRowInput.focus()
      }
    }, 0)
  }

  return (
    <Table className="w-auto justify-self-center">
      <TableCaption>Add your costs and split them with your friends</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-fit">Name</TableHead>
          <TableHead className="w-fit">Amount</TableHead>
          <TableHead className="w-fit">Payed By</TableHead>
          {payers.map((payer) => (
            <TableHead className="w-fit" key={payer.id}>{payer.name}</TableHead>
          ))}
          <TableHead className="w-fit">
            <Button aria-description='Add additional payer' variant="outline" size="icon"><PlusCircleIcon /></Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableRows.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="w-fit">
              <Input
                type="text"
                placeholder="Cost Name"
                value={row.costname}
                onChange={(e) => handleCostNameChange(row.id, e.target.value)}
                data-row-id={row.id}
              />
            </TableCell>
            <TableCell className="w-fit">
              <Input
                type="number"
                placeholder="Amount"
                value={row.amount}
                onChange={(e) => handleAmountChange(row.id, e.target.value)}
              />
            </TableCell>
            <TableCell className="w-fit">
              <Select onValueChange={(value) => handlePayerChange(row.id, value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={payers.find((payer) => payer.id === row.payedBy)?.name} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {payers.map((payer) => (
                      <SelectItem key={payer.id} value={String(payer.id)}>{payer.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </TableCell>
            {payers.map(payer => (
              <TableCell className="w-fit" key={payer.id}>
                <div className="relative flex justify-center">
                  <Input
                    type="number"
                    placeholder="Share"
                    value={row.costSplitting.get(payer.id)}
                    onChange={(e) => handleCostSplittingChange(row.id, payer.id, e.target.value)}
                    className="pr-6 w-20"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2">%</span>
                </div>
              </TableCell>
            ))}
          </TableRow>
        ))}
        <TableRow>
          <TableCell>
            <Button
              aria-description='Add a new cost'
              variant="outline"
              size="icon"
              onClick={handleAddRow}
            >
              <PlusCircleIcon />
            </Button>
          </TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          {payers.map(payer => (
            <TableCell key={payer.id}></TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  )
}