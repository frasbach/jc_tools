import { useState, useCallback } from 'react';
import { TableRowI, Payer } from '@/types/interfaces';
import { initialTableRows, initialPayers } from '@/lib/static-data-provider';
import {
  calculateMinimalTransactions,
  calculatePayerBalance,
  calculateTotalAmount,
} from '@/lib/transaction-calculation';

interface ExportData {
  readonly tableRows: Array<
    Omit<TableRowI, 'costfactor'> & {
      readonly costfactor: [number, number][];
    }
  >;
  readonly payers: Payer[];
  readonly defaultCostFactor: number;
  readonly defaultPayer: number;
}

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

  const handleExportJson = useCallback(() => {
    const exportData: ExportData = {
      tableRows: tableRows.map((row) => ({
        ...row,
        costfactor: Array.from(row.costfactor.entries()),
      })),
      payers,
      defaultCostFactor,
      defaultPayer,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });

    const timestamp = new Date().toISOString().split('T')[0];
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `cost_splitter_export_${timestamp}.json`;
    link.click();

    URL.revokeObjectURL(url); // Clean up the URL object
  }, [tableRows, payers, defaultCostFactor, defaultPayer]);

  const isCorrectDataStructure = (data: any): data is ExportData => {
    return (
      Array.isArray(data.tableRows) &&
      data.tableRows.every(
        (row: any) =>
          Array.isArray(row.costfactor) &&
          row.costfactor.every(
            ([key, value]: [number, number]) =>
              typeof key === 'number' && typeof value === 'number',
          ),
      ) &&
      Array.isArray(data.payers) &&
      data.payers.every(
        (payer: any) =>
          typeof payer.id === 'number' && typeof payer.name === 'string',
      ) &&
      typeof data.defaultCostFactor === 'number' &&
      typeof data.defaultPayer === 'number'
    );
  };

  const handleImportJson = async (file: File): Promise<void> => {
    try {
      const fileContent = await file.text();
      const importedData = JSON.parse(fileContent);

      if (!isCorrectDataStructure(importedData)) {
        throw new Error('Invalid JSON structure');
      }

      // Convert the costfactor arrays back to Maps
      const processedRows: TableRowI[] = importedData.tableRows.map((row) => ({
        ...row,
        costfactor: new Map(row.costfactor),
      }));

      // Update the table state
      setPayers(importedData.payers);
      setTableRows(processedRows);

      // Update default settings if they exist
      if (typeof importedData.defaultCostFactor === 'number') {
        setDefaultCostFactor(importedData.defaultCostFactor);
      }
      if (typeof importedData.defaultPayer === 'number') {
        setDefaultPayer(importedData.defaultPayer);
      }
    } catch (err) {
      console.error('Failed to import JSON:', err);
    }
  };

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
      handleExportJson,
      handleImportJson,
    },
  };
};
