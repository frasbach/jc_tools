'use client';

import { DataTable } from '@/custom-components/data-table';
import { createColumns } from '@/custom-components/columns';
import { TransactionSummary } from '@/custom-components/transaction-summary';
import { useSplittingTable } from '@/hooks/use-splitting-table';
import { Input } from '@/ui-components/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui-components/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui-components/select';

export default function SplittingTable() {
  const {
    tableRows,
    payers,
    totalAmount,
    payerBalances,
    transactions,
    hasValidPayerAssignments,
    defaultCostFactor,
    defaultPayer,
    handlers,
  } = useSplittingTable();

  const columns = createColumns(
    {
      payers,
      totalAmount,
      payerBalances,
      defaultCostFactor,
    },
    handlers,
  );

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Default Settings</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div>
            <label
              htmlFor="defaultCostFactor"
              className="text-sm font-medium block mb-2"
            >
              Cost Factor
            </label>
            <Input
              id="defaultCostFactor"
              type="number"
              min={1}
              max={1000}
              value={defaultCostFactor}
              onChange={(e) =>
                handlers.handleDefaultCostFactorChange(Number(e.target.value))
              }
              className="w-32"
            />
          </div>
          <div>
            <label
              htmlFor="defaultPayer"
              className="text-sm font-medium block mb-2"
            >
              Default Payer
            </label>
            <Select
              value={String(defaultPayer)}
              onValueChange={(value) =>
                handlers.handleDefaultPayerChange(Number(value))
              }
            >
              <SelectTrigger id="defaultPayer" className="w-[180px]">
                <SelectValue>
                  {payers.find((p) => p.id === defaultPayer)?.name ||
                    'Select payer'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {payers.map((payer) => (
                  <SelectItem key={payer.id} value={String(payer.id)}>
                    {payer.name || `Payer ${payer.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <DataTable
        columns={columns}
        data={tableRows}
        onAddRow={handlers.handleAddRow}
        onAddPayer={handlers.handleAddPayer}
      />
      <TransactionSummary
        transactions={transactions}
        payers={payers}
        hasValidPayerAssignments={hasValidPayerAssignments}
      />
    </div>
  );
}
