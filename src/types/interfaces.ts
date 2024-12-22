import { ColumnDef } from '@tanstack/react-table';
import { SidebarGroupType } from '@/config/site-config';

// Core Domain Types
export interface Payer {
  readonly id: number;
  readonly name: string;
}

export interface Transaction {
  readonly fromUserId: number;
  readonly toUserId: number;
  readonly amount: number;
}

export interface PayerBalance {
  readonly id: number;
  readonly balance: number;
}

// Table Data Types
export interface TableRowBase {
  readonly id: number;
  readonly costname: string;
  readonly costamount: number;
  readonly payedByUserId: number;
}

export interface TableRow extends TableRowBase {
  readonly costfactor: Map<number, number>;
}

// Component Props Types
export interface TransactionSummaryProps {
  readonly transactions: Transaction[];
  readonly payers: Payer[];
  readonly hasValidPayerAssignments: boolean;
}

export interface AppSidebarProps {
  readonly sidebarGroups: SidebarGroupType[];
}

export interface DefaultSettingsCardProps {
  readonly defaultCostFactor: number;
  readonly defaultPayer: number;
  readonly payers: Payer[];
  readonly onDefaultCostFactorChange: (value: number) => void;
  readonly onDefaultPayerChange: (value: number) => void;
  readonly onResetTable: () => void;
  readonly onExportJson: () => void;
  readonly onImportJson: (file: File) => void;
}

// Table Configuration Types
export interface ColumnConfig {
  readonly payers: Payer[];
  readonly totalAmount: number;
  readonly payerBalances: PayerBalance[];
  readonly defaultCostFactor: number;
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
  readonly handleDefaultCostFactorChange: (value: number) => void;
}

export interface DataTableProps<TData extends TableRowBase> {
  readonly columns: ColumnDef<TData, any>[];
  readonly data: TData[];
  readonly onAddRow: () => void;
  readonly onAddPayer: () => void;
  readonly handlers: ColumnHandlers;
  readonly config: ColumnConfig;
}

// State Types
export interface SplittingTableState {
  readonly tableRows: TableRow[];
  readonly payers: Payer[];
  readonly allRowsHavePayer: boolean;
}

// Data Transfer Types
export interface ExportData {
  readonly tableRows: TableRow[];
  readonly payers: Payer[];
  readonly defaultCostFactor: number;
  readonly defaultPayer: number;
}

export interface RenderedTransaction {
  readonly fromPayerName: string;
  readonly amount: string;
  readonly toPayerName: string;
}
