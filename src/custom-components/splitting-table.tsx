'use client';

import { DataTable } from '@/custom-components/data-table';
import { createColumns } from '@/custom-components/columns';
import { TransactionSummary } from '@/custom-components/transaction-summary';
import { useSplittingTable } from '@/hooks/use-splitting-table';
import { Input } from '@/ui-components/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui-components/card';

export default function SplittingTable() {
  const {
    tableRows,
    payers,
    totalAmount,
    payerBalances,
    transactions,
    hasValidPayerAssignments,
    defaultCostFactor,
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
          <CardTitle>Default Cost Factor</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="number"
            min={1}
            max={1000}
            value={defaultCostFactor}
            onChange={(e) =>
              handlers.handleDefaultCostFactorChange(Number(e.target.value))
            }
            className="w-32"
          />
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
