import { TableRow, Payer } from '@/types/interfaces';

export const initialTableRows: TableRow[] = [
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

export const initialPayers: Payer[] = [
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
