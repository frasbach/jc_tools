import { Transaction } from '@/lib/transaction-calculation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface TransactionSummaryProps {
  transactions: Transaction[];
  payers: { id: number; name: string }[];
}

export function TransactionSummary({
  transactions,
  payers,
}: TransactionSummaryProps) {
  const getPayerName = (id: number) =>
    payers.find((p) => p.id === id)?.name ?? 'Unknown';

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="text-xl">Settlement Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <span className="font-medium">
              {getPayerName(transaction.fromUserId)}
            </span>
            <div className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              <span className="font-mono">
                ${transaction.amount.toFixed(2)}
              </span>
            </div>
            <span className="font-medium">
              {getPayerName(transaction.toUserId)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
