'use client';

import { DataTableProps, TableRowI } from '@/types/interfaces';
import { Button } from '@/ui-components/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui-components/table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { MinusCircleIcon, PlusCircleIcon } from 'lucide-react';

export function DataTable({
  columns,
  data,
  onAddRow,
  onAddPayer,
  handlers,
  config,
}: DataTableProps<TableRowI>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {table
              .getHeaderGroups()
              .map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                )),
              )}
            <TableHead>
              <div className="space-y-2 min-w-30 h-full">
                <div className="flex items-center justify-center h-1/2">
                  <Button
                    aria-description="Add additional payer"
                    variant="outline"
                    size="icon"
                    onClick={onAddPayer}
                  >
                    <PlusCircleIcon />
                  </Button>
                </div>
                <div className="text-center h-1/2"></div>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell>
              <Button
                aria-description="Add a new cost"
                variant="outline"
                size="icon"
                onClick={onAddRow}
              >
                <PlusCircleIcon />
              </Button>
            </TableCell>
            <TableCell />
            <TableCell />
            {columns
              .filter((col) => col.id?.startsWith('split-'))
              .map((col) => {
                const payerId = Number(col.id?.split('-')[1]);
                return (
                  <TableCell key={col.id}>
                    <div className="flex justify-center">
                      <Button
                        aria-description="Remove this payer"
                        variant="outline"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handlers.handleDeletePayer(payerId)}
                        disabled={config.payers.length <= 1}
                      >
                        <MinusCircleIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                );
              })}
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
