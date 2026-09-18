// Assignment §7: a user who has not logged in must not be able to use the dashboard.
// The server is the real gate (401 on the API); this just keeps the UI consistent with it.
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  if (status === 'loading') {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Loading">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  if (status === 'anonymous') return <Navigate to="/login" replace />;
  return <>{children}</>;
}
