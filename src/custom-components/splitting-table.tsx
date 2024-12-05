'use client';

import { DataTable } from '@/custom-components/data-table';
import { createColumns } from '@/custom-components/columns';
import { TransactionSummary } from '@/custom-components/transaction-summary';
import { useSplittingTable } from '@/hooks/use-splitting-table';

export default function SplittingTable() {
  const {
    tableRows,
    payers,
    totalAmount,
    payerBalances,
    transactions,
    hasValidPayerAssignments,
    handlers,
  } = useSplittingTable();

  const columns = createColumns(
    {
      payers,
      totalAmount,
      payerBalances,
    },
    handlers,
  );

  return (
    <div className="space-y-8">
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
