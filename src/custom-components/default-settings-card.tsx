'use client';

import { Input } from '@/ui-components/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui-components/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui-components/select';
import { Payer } from '@/types/interfaces';

interface DefaultSettingsCardProps {
  defaultCostFactor: number;
  defaultPayer: number;
  payers: Payer[];
  onDefaultCostFactorChange: (value: number) => void;
  onDefaultPayerChange: (value: number) => void;
}

export function DefaultSettingsCard({
  defaultCostFactor,
  defaultPayer,
  payers,
  onDefaultCostFactorChange,
  onDefaultPayerChange,
}: DefaultSettingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Default Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
        <div>
          <label
            htmlFor="defaultCostFactor"
            className="text-sm font-medium block mb-2"
          >
            Cost Factor
          </label>
          <Input
            id="defaultCostFactor"
            type="number"
            min={1}
            max={1000}
            value={defaultCostFactor}
            onChange={(e) => onDefaultCostFactorChange(Number(e.target.value))}
            className="w-32"
          />
        </div>
        <div>
          <label
            htmlFor="defaultPayer"
            className="text-sm font-medium block mb-2"
          >
            Default Payer
          </label>
          <Select
            value={String(defaultPayer)}
            onValueChange={(value) => onDefaultPayerChange(Number(value))}
          >
            <SelectTrigger id="defaultPayer" className="w-[180px]">
              <SelectValue>
                {payers.find((p) => p.id === defaultPayer)?.name ||
                  'Select payer'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {payers.map((payer) => (
                <SelectItem key={payer.id} value={String(payer.id)}>
                  {payer.name || `Payer ${payer.id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
