'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { Input } from '@/ui-components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui-components/select';
import { Payer, TableRowI } from '@/lib/transaction-calculation';
import { MinusCircleIcon } from 'lucide-react';
import { Button } from '@/ui-components/button';

export const createColumns = (
  payers: Payer[],
  handleCostNameChange: (rowId: number, value: string) => void,
  handleAmountChange: (rowId: number, value: number) => void,
  handlePayerChange: (rowId: number, value: number) => void,
  handleCostSplittingChange: (
    rowId: number,
    payerId: number,
    value: number,
  ) => void,
  handlePayerNameChange: (payerId: number, value: string) => void,
  handleDeleteRow: (rowId: number) => void,
  handleDeletePayer: (payerId: number) => void,
  totalAmount: number,
  payerBalances: { id: number; balance: number }[],
): ColumnDef<TableRowI>[] => [
  {
    accessorKey: 'costname',
    header: (row) => (
      <div className="space-y-2 min-w-30 h-full">
        <div className="flex items-center justify-center h-1/2">Costname</div>
        <div className="text-center h-1/2">
          {row.table.getRowModel().rows.length}
        </div>
      </div>
    ),
    cell: ({ row }) => (
      <div className="min-w-[150px] max-w-[300px]">
        <Input
          type="text"
          placeholder="Cost Name"
          value={row.original.costname}
          onChange={(e) =>
            handleCostNameChange(row.original.id, e.target.value)
          }
          data-row-id={row.original.id}
        />
      </div>
    ),
  },
  {
    accessorKey: 'amount',
    header: () => (
      <div className="space-y-2 w-24">
        <div className="text-center">Amount</div>
        <div className="flex justify-center">
          <Input
            type="number"
            value={totalAmount}
            className="text-right w-24"
            readOnly
          />
        </div>
      </div>
    ),
    cell: ({ row }) => (
      <div className="min-w-24 justify-center">
        <Input
          type="number"
          placeholder="Amount"
          defaultValue={row.original.costamount}
          onBlur={(e) =>
            handleAmountChange(row.original.id, Number(e.target.value))
          }
          className="text-right w-24 justify-center"
        />
      </div>
    ),
  },
  {
    accessorKey: 'payedBy',
    header: () => (
      <div className="space-y-2 min-w-30 h-full">
        <div className="flex items-center justify-center h-1/2">Payed by</div>
        <div className="text-center h-1/2"></div>
      </div>
    ),
    cell: ({ row }) => (
      <div className="min-w-[150px]">
        <Select
          value={String(row.original.payedByUserId)}
          onValueChange={(value) =>
            handlePayerChange(row.original.id, Number(value))
          }
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
      </div>
    ),
  },
  ...payers.map((payer) => {
    const balance =
      payerBalances.find((pb) => pb.id === payer.id)?.balance ?? 0;
    return {
      id: `split-${payer.id}`,
      header: () => (
        <div className="space-y-2">
          <div className="text-center min-w-[90px] flex items-center gap-2">
            <Input
              type="text"
              defaultValue={payer.name}
              className="text-center w-24"
              onBlur={(e) => handlePayerNameChange(payer.id, e.target.value)}
            />
          </div>
          <div className="flex justify-center">
            <Input
              type="text"
              value={balance >= 0 ? balance : `-${Math.abs(balance)}`}
              className="text-right w-20"
              readOnly
            />
            <Button
              aria-description="Remove this payer"
              variant="outline"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => handleDeletePayer(payer.id)}
              disabled={payers.length <= 1}
            >
              <MinusCircleIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ),
      cell: ({ row }: { row: Row<TableRowI> }) => (
        <div className="relative flex justify-center">
          <Input
            type="number"
            placeholder="Share"
            defaultValue={row.original.costfactor.get(payer.id)}
            onBlur={(e) =>
              handleCostSplittingChange(
                row.original.id,
                payer.id,
                Number(e.target.value),
              )
            }
            className="w-24 text-right"
          />
        </div>
      ),
    };
  }),
  {
    id: 'actions',
    header: () => <div className="w-9" />,
    cell: ({ row }) => (
      <Button
        aria-description="Delete this cost"
        variant="outline"
        size="icon"
        className="text-destructive hover:text-destructive"
        onClick={() => handleDeleteRow(row.original.id)}
      >
        <MinusCircleIcon className="h-4 w-4" />
      </Button>
    ),
  },
];
