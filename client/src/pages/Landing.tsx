// Assignment §5: "/" is public and explains AI Capsule. Content mirrors the brief: what the app
// is, how login works, what a record stores, and that every record is private to its owner.
import {
  BarChart3,
  BookMarked,
  GitBranch,
  KeyRound,
  LayoutGrid,
  Lock,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { GitHubSignInButton } from '@/components/auth/GitHubSignInButton';
import { LogoMark } from '@/components/brand/Logo';
import { CapsuleCard } from '@/components/capsules/CapsuleCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { SAMPLE_CAPSULES } from './landingSamples';

const STEPS = [
  {
    icon: UserCheck,
    title: 'Sign in with GitHub',
    text: 'No password to create. GitHub confirms who you are and our server issues a session cookie.',
  },
  {
    icon: BookMarked,
    title: 'Save a capsule',
    text: 'The prompt, what the AI answered, which project it was for, its version and how useful it was.',
  },
  {
    icon: Sparkles,
    title: 'Review and improve',
    text: 'Mark responses as reviewed, record improved versions, and find any prompt again with search and filters.',
  },
];

const FIELDS: [string, string][] = [
  ['Project', 'The assignment or project the prompt belongs to'],
  ['Title', 'A short name so you can find it later'],
  ['Version', 'v1, v2, v3 — each iteration of the same prompt'],
  ['Prompt text', 'The exact prompt you sent'],
  ['Response summary', 'What the AI answered, in your words'],
  ['Category', 'Coding, Writing, Research, Debugging, Study, Other'],
  ['Usefulness', 'Good or Needs Improvement'],
  ['Reviewed', 'Have you checked the response?'],
  ['Improved', 'Did the output get better after changes?'],
  ['Screenshot', 'A link to evidence of the result'],
  ['Notes', 'Your reflection on what worked'],
  ['Created', 'Timestamp, added automatically'],
];

const FEATURES = [
  {
    icon: Search,
    title: 'Search and filters',
    text: 'Full-text search across your records, filtered by category, rating and status.',
  },
  {
    icon: BarChart3,
    title: 'Overview',
    text: 'Totals, review and improvement rates, records per category and per week.',
  },
  {
    icon: LayoutGrid,
    title: 'Grid or table',
    text: 'Browse as cards or scan everything in a table — your choice is remembered.',
  },
  {
    icon: GitBranch,
    title: 'Version tracking',
    text: 'Keep v1, v2, v3 side by side and see which wording actually worked.',
  },
];

const PRIVACY = [
  {
    icon: KeyRound,
    title: 'GitHub OAuth',
    text: 'You sign in with GitHub; we never see or store a password.',
  },
  {
    icon: Lock,
    title: 'Server-issued session',
    text: 'After login our server issues its own token in an HttpOnly cookie — scripts in the page cannot read it.',
  },
  {
    icon: ShieldCheck,
    title: 'Your records only',
    text: 'Every capsule is tied to your GitHub ID. Reading, editing and deleting are restricted to the owner.',
  },
];

const STACK = ['React', 'TypeScript', 'Express', 'PostgreSQL', 'Docker', 'GitHub OAuth', 'JWT'];

function CallToAction({ secondary = true }: { secondary?: boolean }) {
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
    <div className="flex flex-wrap justify-center gap-3">
      <GitHubSignInButton />
      {secondary && (
        <Button asChild size="lg" variant="outline">
          <a href="#how-it-works">See how it works</a>
        </Button>
      )}
    </div>
  );
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-6 text-center">
      <h2 className="text-2xl font-semibold tracking-tight">{children}</h2>
      {sub && <p className="text-muted-foreground mt-1 text-sm">{sub}</p>}
    </div>
  );
}

export function Landing() {
  return (
    <div className="space-y-20">
      <section className="space-y-5 pt-6 text-center">
        <LogoMark className="mx-auto size-16" />
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          CSE5006 · Assignment 3
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Your private AI prompt library
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Good prompts for ChatGPT, Copilot, Gemini and Claude are easy to lose. AI Capsule keeps
          each one with its project, version, the answer you got and how useful it was — so you can
          review it, improve it and find it again.
        </p>
        <CallToAction />
        <p className="text-muted-foreground text-xs">
          GitHub OAuth · no passwords stored · only you can see your records
        </p>
      </section>

      <section aria-labelledby="preview-title">
        <SectionTitle sub="Two example capsules, rendered exactly as they appear on your dashboard.">
          <span id="preview-title">What a capsule looks like</span>
        </SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          {SAMPLE_CAPSULES.map((c) => (
            <CapsuleCard key={c.id} capsule={c} />
          ))}
        </div>
      </section>

      <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-6">
        <SectionTitle>
          <span id="how-title">How it works</span>
        </SectionTitle>
        <ol className="grid gap-4 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-sm font-semibold">
                      {i + 1}
                    </span>
                    <Icon className="text-muted-foreground size-5" aria-hidden="true" />
                  </div>
                  <CardTitle className="pt-2">{title}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">{text}</CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="fields-title">
        <SectionTitle sub="Everything a record keeps, so the context is never lost.">
          <span id="fields-title">What a capsule stores</span>
        </SectionTitle>
        <dl className="grid gap-x-8 gap-y-3 rounded-xl border p-6 sm:grid-cols-2">
          {FIELDS.map(([term, desc]) => (
            <div key={term} className="grid grid-cols-[8rem_1fr] gap-3 text-sm">
              <dt className="font-medium">{term}</dt>
              <dd className="text-muted-foreground">{desc}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="features-title">
        <SectionTitle>
          <span id="features-title">Built to keep prompts useful</span>
        </SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <Card key={title}>
              <CardHeader>
                <Icon className="text-muted-foreground mb-1 size-5" aria-hidden="true" />
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">{text}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="privacy-title">
        <SectionTitle>
          <span id="privacy-title">Private by design</span>
        </SectionTitle>
        <div className="grid gap-4 sm:grid-cols-3">
          {PRIVACY.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-3">
              <Icon className="text-muted-foreground mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-medium">{title}</h3>
                <p className="text-muted-foreground text-sm">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="stack-title" className="text-center">
        <h2
          id="stack-title"
          className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase"
        >
          Built with
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {STACK.map((s) => (
            <Badge key={s} variant="outline">
              {s}
            </Badge>
          ))}
        </div>
      </section>

      <section className="rounded-xl border px-6 py-10 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Start your prompt library</h2>
        <p className="text-muted-foreground mx-auto mt-2 mb-6 max-w-md text-sm">
          Sign in with GitHub and save your first capsule in under a minute.
        </p>
        <CallToAction secondary={false} />
      </section>
    </div>
  );
}
