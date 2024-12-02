'use client';

import { useState } from 'react';
import { DataTable } from '@/components/data-table';
import { createColumns } from '@/components/columns';
import { Payer, TableRowI } from '@/lib/transaction-calculation';
import { TransactionSummary } from '@/components/transaction-summary';
import { calculateMinimalTransactions } from '@/lib/transaction-calculation';

const initialTableRows: TableRowI[] = [
  {
    id: 1,
    costname: 'Essen',
    costamount: 123.55,
    payedByUserId: 1,
    costfactor: new Map([
      [1, 100],
      [2, 100],
      [3, 100],
    ]),
  },
  {
    id: 2,
    costname: 'Getränke',
    costamount: 95.75,
    payedByUserId: 2,
    costfactor: new Map([
      [1, 100],
      [2, 100],
      [3, 100],
    ]),
  },
  {
    id: 3,
    costname: 'Taxi',
    costamount: 45.3,
    payedByUserId: 3,
    costfactor: new Map([
      [1, 100],
      [2, 100],
      [3, 100],
    ]),
  },
];

const initialPayers: Payer[] = [
  {
    id: 1,
    name: 'Max Mustermann',
  },
  {
    id: 2,
    name: 'Peter Muffey',
  },
  {
    id: 3,
    name: 'Sebastian Meier',
  },
];

const calculateTotalAmount = (rows: TableRowI[]): number => {
  return rows.reduce((sum, row) => sum + row.costamount, 0);
};

const calculatePayerBalance = (rows: TableRowI[], payerId: number): number => {
  return rows.reduce((balance, row) => {
    // What they paid (if they paid for this cost)
    const paid = row.payedByUserId === payerId ? row.costamount : 0;

    // Calculate total factors for this cost
    const totalFactors = Array.from(row.costfactor.values()).reduce(
      (sum, factor) => sum + factor,
      0,
    );

    // Calculate their share of this cost based on their factor
    const theirFactor = row.costfactor.get(payerId) || 0;
    const theirShare =
      totalFactors > 0 ? (theirFactor / totalFactors) * row.costamount : 0;

    // Add what they paid, subtract what they owe
    return Number((balance + paid - theirShare).toFixed(2));
  }, 0);
};

export default function SplittingTable() {
  const [tableRows, setTableRows] = useState<TableRowI[]>(initialTableRows);
  const [payers, setPayers] = useState<Payer[]>(initialPayers);

  const handleCostNameChange = (rowId: number, newName: string) => {
    setTableRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId ? { ...row, costname: newName } : row,
      ),
    );
  };

  const handleAmountChange = (rowId: number, newAmount: number): void => {
    setTableRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId ? { ...row, costamount: newAmount } : row,
      ),
    );
  };

  const handlePayerChange = (rowId: number, newPayerId: number): void => {
    setTableRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId ? { ...row, payedByUserId: newPayerId } : row,
      ),
    );
  };

  const handleCostSplittingChange = (
    rowId: number,
    payerId: number,
    newAmount: number,
  ): void => {
    setTableRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === rowId) {
          const updatedSplitting = new Map(row.costfactor);
          updatedSplitting.set(payerId, newAmount);
          return { ...row, costfactor: updatedSplitting };
        }
        return row;
      }),
    );
  };

  const handleAddRow = (): void => {
    const newId = Math.max(...tableRows.map((row) => row.id), 0) + 1;
    const defaultSplitting = new Map(payers.map((payer) => [payer.id, 0]));

    const newRow: TableRowI = {
      id: newId,
      costname: '',
      costamount: 0,
      payedByUserId: payers[0]?.id ?? 1,
      costfactor: defaultSplitting,
    };

    setTableRows((prevRows) => [...prevRows, newRow]);
  };

  const handleAddPayer = (): void => {
    const newId = Math.max(...payers.map((payer) => payer.id), 0) + 1;
    const newPayer: Payer = {
      id: newId,
      name: '',
    };

    setPayers((prevPayers) => [...prevPayers, newPayer]);

    // Update all existing rows to include the new payer in costSplitting
    setTableRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        costSplitting: new Map([
          ...Array.from(row.costfactor.entries()),
          [newId, 0],
        ]),
      })),
    );
  };

  const handlePayerNameChange = (payerId: number, newName: string): void => {
    setPayers((prevPayers) =>
      prevPayers.map((payer) =>
        payer.id === payerId ? { ...payer, name: newName } : payer,
      ),
    );
  };

  const handleDeleteRow = (rowId: number): void => {
    setTableRows((prevRows) => prevRows.filter((row) => row.id !== rowId));
  };

  const handleDeletePayer = (payerId: number): void => {
    // Remove payer from payers list
    setPayers((prevPayers) =>
      prevPayers.filter((payer) => payer.id !== payerId),
    );

    // Update all existing rows to remove this payer's cost splitting
    setTableRows((prevRows) =>
      prevRows.map((row) => {
        const newCostSplitting = new Map();
        newCostSplitting.delete(payerId);
        return {
          ...row,
          // If this payer was paying for the cost, assign it to the first remaining payer
          payedBy:
            row.payedByUserId === payerId
              ? payers[0]?.id ?? 1
              : row.payedByUserId,
          costSplitting: newCostSplitting,
        };
      }),
    );
  };

  const totalAmount = calculateTotalAmount(tableRows);
  const payerBalances = payers.map((payer) => ({
    id: payer.id,
    balance: calculatePayerBalance(tableRows, payer.id),
  }));

  const columns = createColumns(
    payers,
    handleCostNameChange,
    handleAmountChange,
    handlePayerChange,
    handleCostSplittingChange,
    handlePayerNameChange,
    handleDeleteRow,
    handleDeletePayer,
    totalAmount,
    payerBalances,
  );

  const transactions = calculateMinimalTransactions(payerBalances);

  return (
    <div className="space-y-8">
      <DataTable
        columns={columns}
        data={tableRows}
        onAddRow={handleAddRow}
        onAddPayer={handleAddPayer}
      />
      <TransactionSummary transactions={transactions} payers={payers} />
    </div>
  );
}
