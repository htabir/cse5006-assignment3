// Assignment §5: "/dashboard" is protected and shows the authenticated user's records.
import { useAuth } from '@/hooks/useAuth';

export function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Your capsules</h1>
      <p className="text-muted-foreground text-sm">
        Signed in as {user?.login}. Your records will appear here.
      </p>
    </div>
  );
}
