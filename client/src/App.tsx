import { Button } from '@/components/ui/button';

// Placeholder to prove the Vite + Tailwind + shadcn pipeline; replaced by routes.tsx in the next commit.
export default function App() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold tracking-tight">AI Capsule</h1>
      <p className="text-muted-foreground">Client scaffold is working.</p>
      <Button asChild>
        <a href="/api/health">Check API health</a>
      </Button>
    </main>
  );
}
