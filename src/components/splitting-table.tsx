"use client"

import { useState } from 'react'
import { DataTable } from '@/components/data-table'
import { createColumns, TableRowI, Payer } from '@/components/columns';

const initialTableRows: TableRowI[] = [
  {
    id: 1,
    costname: "Essen",
    amount: 123,
    payedBy: 1,
    costSplitting: new Map([
      [1, 100],
      [2, 100],
      [3, 100]
    ])
  },
  {
    id: 2,
    costname: "Getränke",
    amount: 95,
    payedBy: 2,
    costSplitting: new Map([
      [1, 100],
      [2, 100],
      [3, 100]
    ])
  },
  {
    id: 3,
    costname: "Taxi",
    amount: 45,
    payedBy: 3,
    costSplitting: new Map([
      [1, 100],
      [2, 100],
      [3, 100]
    ])
  }
]

const initialPayers: Payer[] = [
  {
    id: 1,
    name: "Max Mustermann"
  },
  {
    id: 2,
    name: "Peter Muffey",
  },
  {
    id: 3,
    name: "Sebastian Meier"
  }
]

export default function SplittingTable() {
  const [tableRows, setTableRows] = useState<TableRowI[]>(initialTableRows)
  const [payers, setPayers] = useState<Payer[]>(initialPayers)

  const handleCostNameChange = (rowId: number, newName: string) => {
    setTableRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId ? { ...row, costname: newName } : row
      )
    )
  }

  const handleAmountChange = (rowId: number, newAmount: number): void => {
    setTableRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId ? { ...row, amount: newAmount } : row
      )
    );
  };

  const handlePayerChange = (rowId: number, newPayerId: number): void => {
    setTableRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId ? { ...row, payedBy: newPayerId } : row
      )
    );
  };

  const handleCostSplittingChange = (
    rowId: number,
    payerId: number,
    newAmount: number
  ): void => {
    setTableRows(prevRows =>
      prevRows.map(row => {
        if (row.id === rowId) {
          const updatedSplitting = new Map(row.costSplitting);
          updatedSplitting.set(payerId, newAmount);
          return { ...row, costSplitting: updatedSplitting };
        }
        return row;
      })
    );
  };

  const handleAddRow = (): void => {
    const newId = Math.max(...tableRows.map(row => row.id), 0) + 1;
    const defaultSplitting = new Map(
      payers.map(payer => [payer.id, 0])
    );
    
    const newRow: TableRowI = {
      id: newId,
      costname: "",
      amount: 0,
      payedBy: payers[0]?.id ?? 1,
      costSplitting: defaultSplitting
    };
    
    setTableRows(prevRows => [...prevRows, newRow]);
  };

  const handleAddPayer = (): void => {
    const newId = Math.max(...payers.map(payer => payer.id), 0) + 1;
    const newPayer: Payer = {
      id: newId,
      name: ""
    };
    
    setPayers(prevPayers => [...prevPayers, newPayer]);
    
    // Update all existing rows to include the new payer in costSplitting
    setTableRows(prevRows =>
      prevRows.map(row => ({
        ...row,
        costSplitting: new Map([
          ...Array.from(row.costSplitting.entries()),
          [newId, 0]
        ])
      }))
    );
  };

  const columns = createColumns(
    payers,
    handleCostNameChange,
    handleAmountChange,
    handlePayerChange,
    handleCostSplittingChange
  )

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={tableRows}
        onAddRow={handleAddRow}
        onAddPayer={handleAddPayer}
      />
    </div>
  )
}