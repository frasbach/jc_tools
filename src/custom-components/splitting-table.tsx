'use client';

import { DataTable } from '@/custom-components/data-table';
import { createColumns } from '@/custom-components/columns';
import { TransactionSummary } from '@/custom-components/transaction-summary';
import { useSplittingTable } from '@/hooks/use-splitting-table';
import { DefaultSettingsCard } from '@/custom-components/default-settings-card';

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
      <DefaultSettingsCard
        defaultCostFactor={defaultCostFactor}
        defaultPayer={defaultPayer}
        payers={payers}
        onDefaultCostFactorChange={handlers.handleDefaultCostFactorChange}
        onDefaultPayerChange={handlers.handleDefaultPayerChange}
      />
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
