import { Link } from 'react-router-dom';
import { GitHubSignInButton } from '@/components/auth/GitHubSignInButton';

export function AppHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          AI Capsule
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <GitHubSignInButton className="h-8 px-3 text-sm" />
        </nav>
      </div>
    </header>
  );
}
