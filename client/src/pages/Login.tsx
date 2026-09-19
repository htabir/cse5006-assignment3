// Assignment §5: "/login" is public and starts the OAuth login. A user who already has a session
// is sent straight to the dashboard.
import { Navigate, useSearchParams } from 'react-router-dom';
import { GitHubSignInButton } from '@/components/auth/GitHubSignInButton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';

export function Login() {
  const [params] = useSearchParams();
  const { status } = useAuth();
  const failed = params.get('error') === 'oauth_failed';

  if (status === 'authenticated') return <Navigate to="/dashboard" replace />;
  if (status === 'loading') return <Skeleton className="mx-auto h-48 max-w-md" />;

  return (
    <div className="mx-auto max-w-md space-y-4">
      {failed && (
        <Alert variant="destructive">
          <AlertTitle>Sign-in failed</AlertTitle>
          <AlertDescription>GitHub did not complete the login. Please try again.</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            AI Capsule uses GitHub OAuth. After GitHub confirms who you are, our Express server
            issues its own session token and stores it in a secure, HttpOnly cookie.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GitHubSignInButton className="w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
