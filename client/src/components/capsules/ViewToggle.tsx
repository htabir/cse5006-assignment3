import { LayoutGrid, Table2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ViewMode } from '@/hooks/useViewMode';

export function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (m: ViewMode) => void;
}) {
  const options: { mode: ViewMode; label: string; Icon: typeof LayoutGrid }[] = [
    { mode: 'grid', label: 'Grid view', Icon: LayoutGrid },
    { mode: 'table', label: 'Table view', Icon: Table2 },
  ];
  return (
    <fieldset className="bg-muted inline-flex rounded-lg border-0 p-0.5" aria-label="View">
      {options.map(({ mode, label, Icon }) => (
        <Button
          key={mode}
          type="button"
          size="icon-sm"
          variant={value === mode ? 'default' : 'ghost'}
          aria-pressed={value === mode}
          aria-label={label}
          title={label}
          onClick={() => onChange(mode)}
        >
          <Icon aria-hidden="true" />
        </Button>
      ))}
    </fieldset>
  );
}
