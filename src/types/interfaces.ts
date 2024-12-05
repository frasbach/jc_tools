import { ColumnDef } from '@tanstack/react-table';

export interface TableRowI {
  id: number;
  costname: string;
  costamount: number;
  payedByUserId: number;
  costfactor: Map<number, number>;
}

export interface Payer {
  id: number;
  name: string;
}

export interface Transaction {
  fromUserId: number;
  toUserId: number;
  amount: number;
}

export interface PayerBalance {
  id: number;
  balance: number;
}

export interface RenderedTransaction {
  fromPayerName: string;
  amount: string;
  toPayerName: string;
}

export interface SplittingTableState {
  tableRows: TableRowI[];
  payers: Payer[];
  allRowsHavePayer: boolean;
}

export interface TransactionSummaryProps {
  transactions: Transaction[];
  payers: Payer[];
  hasValidPayerAssignments: boolean;
}

export interface DataTableProps<TData extends { id: number }> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  onAddRow: () => void;
  onAddPayer: () => void;
}

export interface ColumnHandlers {
  readonly handleCostNameChange: (rowId: number, value: string) => void;
  readonly handleAmountChange: (rowId: number, value: number) => void;
  readonly handlePayerChange: (rowId: number, value: number) => void;
  readonly handleCostSplittingChange: (
    rowId: number,
    payerId: number,
    value: number,
  ) => void;
  readonly handlePayerNameChange: (payerId: number, value: string) => void;
  readonly handleDeleteRow: (rowId: number) => void;
  readonly handleDeletePayer: (payerId: number) => void;
}

export interface ColumnConfig {
  readonly payers: readonly Payer[];
  readonly totalAmount: number;
  readonly payerBalances: readonly { id: number; balance: number }[];
}
