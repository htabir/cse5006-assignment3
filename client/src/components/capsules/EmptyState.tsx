import { Card, CardContent } from '@/components/ui/card';

export function EmptyState({ action }: { action?: React.ReactNode }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="font-medium">No capsules yet</p>
        <p className="text-muted-foreground max-w-sm text-sm">
          Save your first prompt — the project it belongs to, the prompt itself and how useful the
          answer was.
        </p>
        {action}
      </CardContent>
    </Card>
  );
}
