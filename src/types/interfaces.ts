import { SidebarGroupType } from '@/config/site-config';
import { ColumnDef } from '@tanstack/react-table';

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

export interface TableRowI extends TableRowBase {
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
  readonly onDefaultCostFactorChange: (_value: number) => void;
  readonly onDefaultPayerChange: (_value: number) => void;
  readonly onResetTable: () => void;
  readonly onExportJson: () => void;
  readonly onImportJson: (_file: File) => void;
}

// Table Configuration Types
export interface ColumnConfig {
  readonly payers: Payer[];
  readonly totalAmount: number;
  readonly payerBalances: PayerBalance[];
  readonly defaultCostFactor: number;
}

export interface ColumnHandlers {
  readonly handleCostNameChange: (_rowId: number, _value: string) => void;
  readonly handleAmountChange: (_rowId: number, _value: number) => void;
  readonly handlePayerChange: (_rowId: number, _value: number) => void;
  readonly handleCostSplittingChange: (
    _rowId: number,
    _payerId: number,
    _value: number,
  ) => void;
  readonly handlePayerNameChange: (_payerId: number, _value: string) => void;
  readonly handleDeleteRow: (_rowId: number) => void;
  readonly handleDeletePayer: (_payerId: number) => void;
  readonly handleDefaultCostFactorChange: (_value: number) => void;
}

export interface DataTableProps<TData extends TableRowBase> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly columns: ColumnDef<TData, any>[];
  readonly data: TData[];
  readonly onAddRow: () => void;
  readonly onAddPayer: () => void;
  readonly handlers: ColumnHandlers;
  readonly config: ColumnConfig;
}

// State Types
export interface SplittingTableState {
  readonly tableRows: TableRowI[];
  readonly payers: Payer[];
  readonly allRowsHavePayer: boolean;
}

// Data Transfer Types
export interface ExportData {
  readonly tableRows: TableRowI[];
  readonly payers: Payer[];
  readonly defaultCostFactor: number;
  readonly defaultPayer: number;
}

export interface RenderedTransaction {
  readonly fromPayerName: string;
  readonly amount: string;
  readonly toPayerName: string;
}
