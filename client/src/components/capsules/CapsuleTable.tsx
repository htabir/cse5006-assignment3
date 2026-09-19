import { CheckCircle2, Circle, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Capsule } from '@/types/capsule';

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });

function Flag({ on, label }: { on: boolean; label: string }) {
  const Icon = on ? CheckCircle2 : Circle;
  return (
    <Icon
      className={`size-4 ${on ? 'text-foreground' : 'text-muted-foreground/50'}`}
      aria-label={`${label}: ${on ? 'yes' : 'no'}`}
    />
  );
}

interface Props {
  capsules: Capsule[];
  actions: (capsule: Capsule) => React.ReactNode;
}

export function CapsuleTable({ capsules, actions }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Usefulness</TableHead>
            <TableHead className="text-center">Reviewed</TableHead>
            <TableHead className="text-center">Improved</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {capsules.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="max-w-72 font-medium">
                <div className="truncate" title={c.prompt_title}>
                  {c.prompt_title}
                </div>
                <div className="text-muted-foreground truncate text-xs" title={c.prompt_text}>
                  {c.prompt_text}
                </div>
              </TableCell>
              <TableCell>{c.project_name}</TableCell>
              <TableCell>{c.prompt_version ?? '—'}</TableCell>
              <TableCell>{c.category ?? '—'}</TableCell>
              <TableCell>
                {c.usefulness ? (
                  <Badge variant={c.usefulness === 'Good' ? 'default' : 'destructive'}>
                    {c.usefulness}
                  </Badge>
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell className="text-center">
                <Flag on={c.reviewed} label="Reviewed" />
              </TableCell>
              <TableCell className="text-center">
                <Flag on={c.improved} label="Improved" />
              </TableCell>
              <TableCell className="text-muted-foreground whitespace-nowrap">
                <time dateTime={c.created_at}>{dateFormat.format(new Date(c.created_at))}</time>
                {c.screenshot_url && (
                  <a
                    href={c.screenshot_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 inline-flex align-middle"
                    aria-label="Open screenshot"
                    title="Open screenshot"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                )}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">{actions(c)}</div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
