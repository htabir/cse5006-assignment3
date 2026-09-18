import { CheckCircle2, Circle, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Capsule } from '@/types/capsule';

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });

function Flag({ on, label }: { on: boolean; label: string }) {
  const Icon = on ? CheckCircle2 : Circle;
  return (
    <span
      className={`flex items-center gap-1 text-xs ${on ? 'text-foreground' : 'text-muted-foreground'}`}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}

export function CapsuleCard({ capsule, actions }: { capsule: Capsule; actions?: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const longPrompt = capsule.prompt_text.length > 240;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{capsule.project_name}</Badge>
          {capsule.prompt_version && <Badge variant="outline">{capsule.prompt_version}</Badge>}
          {capsule.category && <Badge variant="outline">{capsule.category}</Badge>}
          {capsule.usefulness && (
            <Badge variant={capsule.usefulness === 'Good' ? 'default' : 'destructive'}>
              {capsule.usefulness}
            </Badge>
          )}
        </div>
        <CardTitle className="text-base">{capsule.prompt_title}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 text-sm">
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-medium uppercase">Prompt</p>
          <p className={`whitespace-pre-wrap ${expanded || !longPrompt ? '' : 'line-clamp-4'}`}>
            {capsule.prompt_text}
          </p>
          {longPrompt && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? 'Show less' : 'Show more'}
            </Button>
          )}
        </div>
        {capsule.response_summary && (
          <div>
            <p className="text-muted-foreground mb-1 text-xs font-medium uppercase">
              Response summary
            </p>
            <p className="whitespace-pre-wrap">{capsule.response_summary}</p>
          </div>
        )}
        {capsule.notes && (
          <div>
            <p className="text-muted-foreground mb-1 text-xs font-medium uppercase">Notes</p>
            <p className="whitespace-pre-wrap">{capsule.notes}</p>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <Flag on={capsule.reviewed} label="Reviewed" />
          <Flag on={capsule.improved} label="Improved" />
          {capsule.screenshot_url && (
            <a
              href={capsule.screenshot_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs underline underline-offset-2"
            >
              <ExternalLink className="size-3.5" aria-hidden="true" />
              Screenshot
            </a>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2">
        <time dateTime={capsule.created_at} className="text-muted-foreground text-xs">
          {dateFormat.format(new Date(capsule.created_at))}
        </time>
        <div className="flex gap-2">{actions}</div>
      </CardFooter>
    </Card>
  );
}
