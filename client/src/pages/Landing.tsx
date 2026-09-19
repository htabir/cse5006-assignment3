// Assignment §5: "/" is public and explains AI Capsule.
import { BookMarked, Sparkles, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GitHubSignInButton } from '@/components/auth/GitHubSignInButton';
import { LogoMark } from '@/components/brand/Logo';
import { CapsuleCard } from '@/components/capsules/CapsuleCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { SAMPLE_CAPSULES } from './landingSamples';

const STEPS = [
  {
    icon: UserCheck,
    title: 'Sign in with GitHub',
    text: 'No password to create — GitHub confirms who you are and our server issues a session cookie.',
  },
  {
    icon: BookMarked,
    title: 'Save a capsule',
    text: 'The prompt, what the AI answered, the project, its version and how useful it was.',
  },
  {
    icon: Sparkles,
    title: 'Review and improve',
    text: 'Mark responses as reviewed, track improved versions, and find any prompt again with search and filters.',
  },
];

function CallToAction() {
  const { status, user } = useAuth();
  if (status === 'loading') return <Skeleton className="mx-auto h-10 w-56" />;
  if (status === 'authenticated') {
    return (
      <div className="flex flex-col items-center gap-2">
        <Button asChild size="lg">
          <Link to="/dashboard">Go to your dashboard</Link>
        </Button>
        <p className="text-muted-foreground text-sm">Signed in as @{user.login}</p>
      </div>
    );
  }
  return (
    <div className="flex justify-center">
      <GitHubSignInButton />
    </div>
  );
}

export function Landing() {
  return (
    <div className="space-y-16">
      <section className="space-y-5 pt-6 text-center">
        <LogoMark className="mx-auto size-16" />
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Your private AI prompt library
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Good prompts for ChatGPT, Copilot, Gemini and Claude are easy to lose. AI Capsule keeps
          each one with its project, version, the answer you got and how useful it was.
        </p>
        <CallToAction />
        <p className="text-muted-foreground text-xs">
          GitHub OAuth · no passwords stored · only you can see your records
        </p>
      </section>

      <section aria-labelledby="preview-title">
        <h2 id="preview-title" className="mb-6 text-center text-2xl font-semibold tracking-tight">
          What a capsule looks like
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {SAMPLE_CAPSULES.map((c) => (
            <CapsuleCard key={c.id} capsule={c} />
          ))}
        </div>
      </section>

      <section aria-labelledby="how-title">
        <h2 id="how-title" className="mb-6 text-center text-2xl font-semibold tracking-tight">
          How it works
        </h2>
        <ol className="grid gap-6 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="flex gap-3">
              <span className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                {i + 1}
              </span>
              <div>
                <h3 className="flex items-center gap-2 font-medium">
                  {title}
                  <Icon className="text-muted-foreground size-4" aria-hidden="true" />
                </h3>
                <p className="text-muted-foreground mt-1 text-sm">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
