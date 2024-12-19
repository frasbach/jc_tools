import { useState, useCallback } from 'react';
import { TableRowI, Payer } from '@/types/interfaces';
import { initialTableRows, initialPayers } from '@/lib/static-data-provider';
import {
  calculateMinimalTransactions,
  calculatePayerBalance,
  calculateTotalAmount,
} from '@/lib/transaction-calculation';

export const useSplittingTable = () => {
  const [tableRows, setTableRows] = useState<TableRowI[]>(initialTableRows);
  const [payers, setPayers] = useState<Payer[]>(initialPayers);
  const [defaultCostFactor, setDefaultCostFactor] = useState<number>(100);
  const [defaultPayer, setDefaultPayer] = useState<number>(
    initialPayers[0]?.id ?? 1,
  );

  const handleDefaultCostFactorChange = useCallback((newValue: number) => {
    if (newValue >= 1 && newValue <= 1000) {
      setDefaultCostFactor(newValue);
    }
  }, []);

  const handleCostNameChange = useCallback((rowId: number, newName: string) => {
    setTableRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId ? { ...row, costname: newName } : row,
      ),
    );
  }, []);

  const handleAmountChange = useCallback((rowId: number, newAmount: number) => {
    setTableRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId ? { ...row, costamount: newAmount } : row,
      ),
    );
  }, []);

  const handlePayerChange = useCallback((rowId: number, newPayerId: number) => {
    setTableRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId ? { ...row, payedByUserId: newPayerId } : row,
      ),
    );
  }, []);

  const handleCostSplittingChange = useCallback(
    (rowId: number, payerId: number, newAmount: number) => {
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
    },
    [],
  );

  const handleAddRow = useCallback(() => {
    const newId = Math.max(...tableRows.map((row) => row.id), 0) + 1;
    const defaultSplitting = new Map(
      payers.map((payer) => [payer.id, defaultCostFactor]),
    );

    const newRow: TableRowI = {
      id: newId,
      costname: '',
      costamount: 0,
      payedByUserId: defaultPayer,
      costfactor: defaultSplitting,
    };

    setTableRows((prevRows) => [...prevRows, newRow]);
  }, [payers, tableRows, defaultCostFactor, defaultPayer]);

  const handleAddPayer = useCallback(() => {
    const newId = Math.max(...payers.map((payer) => payer.id), 0) + 1;
    const newPayer: Payer = {
      id: newId,
      name: '',
    };

    setPayers((prevPayers) => [...prevPayers, newPayer]);
    setTableRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        costfactor: new Map([
          ...Array.from(row.costfactor.entries()),
          [newId, defaultCostFactor],
        ]),
      })),
    );
  }, [payers, defaultCostFactor]);

  const handlePayerNameChange = useCallback(
    (payerId: number, newName: string) => {
      setPayers((prevPayers) =>
        prevPayers.map((payer) =>
          payer.id === payerId ? { ...payer, name: newName } : payer,
        ),
      );
    },
    [],
  );

  const handleDeleteRow = useCallback((rowId: number) => {
    setTableRows((prevRows) => prevRows.filter((row) => row.id !== rowId));
  }, []);

  const handleDeletePayer = useCallback(
    (payerId: number): void => {
      setPayers((prevPayers) => {
        const updatedPayers = prevPayers.filter(
          (payer) => payer.id !== payerId,
        );
        if (payerId === defaultPayer && updatedPayers.length > 0) {
          const newDefaultPayer = Math.min(
            ...updatedPayers.map((payer) => payer.id),
          );
          setDefaultPayer(newDefaultPayer);
        }
        return updatedPayers;
      });

      setTableRows((prevRows) =>
        prevRows.map((row) =>
          row.payedByUserId === payerId
            ? {
                ...row,
                payedByUserId: Math.min(...payers.map((payer) => payer.id)),
              }
            : row,
        ),
      );
    },
    [payers, defaultPayer],
  );

  const handleDefaultPayerChange = useCallback((newPayerId: number) => {
    setDefaultPayer(newPayerId);
  }, []);

  const handleResetTable = useCallback(() => {
    setTableRows(initialTableRows);
    setPayers(initialPayers);
    setDefaultCostFactor(100);
    setDefaultPayer(initialPayers[0]?.id ?? 1);
  }, []);

  const totalAmount = calculateTotalAmount(tableRows);
  const payerBalances = payers.map((payer) => ({
    id: payer.id,
    balance: calculatePayerBalance(tableRows, payer.id),
  }));
  const transactions = calculateMinimalTransactions(payerBalances);

  const validatePayerAssignments = (): boolean => {
    return tableRows.every(
      (row) => row.payedByUserId && row.payedByUserId != null,
    );
  };

  return {
    tableRows,
    payers,
    totalAmount,
    payerBalances,
    transactions,
    hasValidPayerAssignments: validatePayerAssignments(),
    defaultCostFactor,
    defaultPayer,
    handlers: {
      handleCostNameChange,
      handleAmountChange,
      handlePayerChange,
      handleCostSplittingChange,
      handleAddRow,
      handleAddPayer,
      handlePayerNameChange,
      handleDeleteRow,
      handleDeletePayer,
      handleDefaultCostFactorChange,
      handleDefaultPayerChange,
      handleResetTable,
    },
  };
};
