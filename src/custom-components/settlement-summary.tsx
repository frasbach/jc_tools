import { TransactionSummaryProps as SettlementSummaryProps } from '@/types/interfaces';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui-components/card';
import { ArrowRight } from 'lucide-react';
import React from 'react';
export function SettlementSummary({
  transactions,
  payers,
}: SettlementSummaryProps) {
  const getPayerName = (id: number) =>
    payers.find((p) => p.id === id)?.name ?? 'Unknown';

  // Create an array of rendered transaction data
  const renderedTransactions = transactions.map((transaction) => ({
    fromPayerName: getPayerName(transaction.fromUserId),
    amount: transaction.amount.toFixed(2),
    toPayerName: getPayerName(transaction.toUserId),
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Settlement Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-8">
          {renderedTransactions.map((renderedTransaction, index) => (
            <React.Fragment key={index}>
              <span className="font-medium text-right">
                {renderedTransaction.fromPayerName}
              </span>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <ArrowRight className="h-4 w-4" />
                <span className="font-mono">${renderedTransaction.amount}</span>
              </div>
              <span className="font-medium">
                {renderedTransaction.toPayerName}
              </span>
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
