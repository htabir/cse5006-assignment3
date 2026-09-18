// Assignment §5: "/login" is public and starts the OAuth login.
import { useSearchParams } from 'react-router-dom';
import { GitHubSignInButton } from '@/components/auth/GitHubSignInButton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Login() {
  const [params] = useSearchParams();
  const failed = params.get('error') === 'oauth_failed';

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
            AI Capsule uses GitHub OAuth. After GitHub confirms who you are, our server issues its
            own session token and stores it in a secure, HttpOnly cookie.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GitHubSignInButton className="w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
