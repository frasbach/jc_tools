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
import { Button } from '@/ui-components/button';

interface DefaultSettingsCardProps {
  defaultCostFactor: number;
  defaultPayer: number;
  payers: Payer[];
  onDefaultCostFactorChange: (value: number) => void;
  onDefaultPayerChange: (value: number) => void;
  onResetTable: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
}

export function DefaultSettingsCard({
  defaultCostFactor,
  defaultPayer,
  payers,
  onDefaultCostFactorChange,
  onDefaultPayerChange,
  onResetTable,
  onExportJson,
  onImportJson,
}: DefaultSettingsCardProps) {
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      onImportJson(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings / Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
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
            Payer
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
        <div>
          <Button onClick={onExportJson}>Export as JSON</Button>
        </div>
        <div>
          <Input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
            id="jsonFileInput"
          />
          <Button
            onClick={() => document.getElementById('jsonFileInput')?.click()}
          >
            Import JSON
          </Button>
        </div>
        <div>
          <Button variant="destructive" onClick={onResetTable}>
            Reset Table
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
