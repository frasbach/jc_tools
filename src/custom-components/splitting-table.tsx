'use client';

import { useState } from 'react';
import { DataTable } from '@/custom-components/data-table';
import { createColumns } from '@/custom-components/columns';
import { Payer, TableRowI, SplittingTableState } from '@/types/interfaces';
import { TransactionSummary } from '@/custom-components/transaction-summary';
import {
  calculateMinimalTransactions,
  calculatePayerBalance,
  calculateTotalAmount,
} from '@/lib/transaction-calculation';
import { initialTableRows, initialPayers } from '@/lib/static-data-provider';

export default function SplittingTable() {
  const [state, setState] = useState<SplittingTableState>({
    tableRows: initialTableRows,
    payers: initialPayers,
    allRowsHavePayer: true,
  });

  const handleCostNameChange = (rowId: number, newName: string) => {
    setState((prevState) => ({
      ...prevState,
      tableRows: prevState.tableRows.map((row) =>
        row.id === rowId ? { ...row, costname: newName } : row,
      ),
    }));
  };

  const handleAmountChange = (rowId: number, newAmount: number): void => {
    setState((prevState) => ({
      ...prevState,
      tableRows: prevState.tableRows.map((row) =>
        row.id === rowId ? { ...row, costamount: newAmount } : row,
      ),
    }));
  };

  const handlePayerChange = (rowId: number, newPayerId: number): void => {
    setState((prevState) => ({
      ...prevState,
      tableRows: prevState.tableRows.map((row) =>
        row.id === rowId ? { ...row, payedByUserId: newPayerId } : row,
      ),
    }));
  };

  const handleCostSplittingChange = (
    rowId: number,
    payerId: number,
    newAmount: number,
  ): void => {
    setState((prevState) => ({
      ...prevState,
      tableRows: prevState.tableRows.map((row) => {
        if (row.id === rowId) {
          const updatedSplitting = new Map(row.costfactor);
          updatedSplitting.set(payerId, newAmount);
          return { ...row, costfactor: updatedSplitting };
        }
        return row;
      }),
    }));
  };

  const handleAddRow = (): void => {
    const newId = Math.max(...state.tableRows.map((row) => row.id), 0) + 1;
    const defaultSplitting = new Map(
      state.payers.map((payer) => [payer.id, 0]),
    );

    const newRow: TableRowI = {
      id: newId,
      costname: '',
      costamount: 0,
      payedByUserId: state.payers[0]?.id ?? 1,
      costfactor: defaultSplitting,
    };

    setState((prevState) => ({
      ...prevState,
      tableRows: [...prevState.tableRows, newRow],
    }));
  };

  const handleAddPayer = (): void => {
    const newId = Math.max(...state.payers.map((payer) => payer.id), 0) + 1;
    const newPayer: Payer = {
      id: newId,
      name: '',
    };

    setState((prevState) => ({
      ...prevState,
      payers: [...prevState.payers, newPayer],
      tableRows: prevState.tableRows.map((row) => ({
        ...row,
        costSplitting: new Map([
          ...Array.from(row.costfactor.entries()),
          [newId, 0],
        ]),
      })),
    }));
  };

  const handlePayerNameChange = (payerId: number, newName: string): void => {
    setState((prevState) => ({
      ...prevState,
      payers: prevState.payers.map((payer) =>
        payer.id === payerId ? { ...payer, name: newName } : payer,
      ),
    }));
  };

  const handleDeleteRow = (rowId: number): void => {
    setState((prevState) => ({
      ...prevState,
      tableRows: prevState.tableRows.filter((row) => row.id !== rowId),
    }));
  };

  const handlePayerDeletion = (payerId: number): void => {
    if (state.payers.length <= 1) return;

    setState((prevState) => ({
      ...prevState,
      payers: prevState.payers.filter((payer) => payer.id !== payerId),
      tableRows: prevState.tableRows.map((row) => ({
        ...row,
        payedByUserId:
          row.payedByUserId === payerId
            ? state.payers[0].id
            : row.payedByUserId,
        costfactor: new Map(
          Array.from(row.costfactor.entries()).filter(([id]) => id !== payerId),
        ),
      })),
      allRowsHavePayer: prevState.tableRows.every(
        (row) => row.payedByUserId !== payerId,
      ),
    }));
  };

  const totalAmount = calculateTotalAmount(state.tableRows);
  const payerBalances = state.payers.map((payer) => ({
    id: payer.id,
    balance: calculatePayerBalance(state.tableRows, payer.id),
  }));

  const columns = createColumns(
    {
      payers: state.payers,
      totalAmount,
      payerBalances,
    },
    {
      handleCostNameChange,
      handleAmountChange,
      handlePayerChange,
      handleCostSplittingChange,
      handlePayerNameChange,
      handleDeleteRow,
      handleDeletePayer: handlePayerDeletion,
    },
  );

  const transactions = calculateMinimalTransactions(payerBalances);

  return (
    <div className="space-y-8">
      <DataTable
        columns={columns}
        data={state.tableRows}
        onAddRow={handleAddRow}
        onAddPayer={handleAddPayer}
      />
      <TransactionSummary
        transactions={transactions}
        payers={state.payers}
        allCostsHavePayer={state.allRowsHavePayer}
      />
    </div>
  );
}
