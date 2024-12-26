import { Payer, TableRowI } from '@/types/interfaces';

const getInitialTableRows = (): TableRowI[] => {
  return process.env.NEXT_PUBLIC_IS_DEVELOPMENT === 'true'
    ? intialTableRowsDev
    : initialTableRowsProd;
};

const getInitialPayers = (): Payer[] => {
  return process.env.NEXT_PUBLIC_IS_DEVELOPMENT === 'true'
    ? initialPayersDev
    : initialPayersProd;
};

const initialTableRowsProd = [
  {
    id: 1,
    costname: 'Cost_1',
    costamount: 0,
    payedByUserId: 1,
    costfactor: new Map([
      [1, 100],
      [2, 100],
    ]),
  },
];

const initialPayersProd = [
  {
    id: 1,
    name: 'You',
  },
  {
    id: 2,
    name: 'Your Friend',
  },
];

const intialTableRowsDev = [
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

export const initialPayersDev: Payer[] = [
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

export const initialTableRows: TableRowI[] = getInitialTableRows();
export const initialPayers: Payer[] = getInitialPayers();
