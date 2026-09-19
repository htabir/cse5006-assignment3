// Assignment §5: "/" is public and explains AI Capsule.
import { BookMarked, CheckCircle2, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GitHubSignInButton } from '@/components/auth/GitHubSignInButton';
import { LogoMark } from '@/components/brand/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: BookMarked,
    title: 'Save prompts you want to keep',
    text: 'Store the prompt with its project, version and category so you can find it again.',
  },
  {
    icon: CheckCircle2,
    title: 'Rate and review',
    text: 'Mark each prompt as Good or Needs Improvement, and track whether the response was reviewed and improved.',
  },
  {
    icon: Image,
    title: 'Keep the evidence',
    text: 'Attach a screenshot link and notes so the context is never lost.',
  },
];

export function Landing() {
  return (
    <div className="space-y-12">
      <section className="space-y-4 text-center">
        <LogoMark className="mx-auto size-16" />
        <h1 className="text-4xl font-semibold tracking-tight">Your private AI prompt library</h1>
        <p className="text-muted-foreground mx-auto max-w-2xl">
          AI Capsule keeps the prompts you use with ChatGPT, Copilot, Gemini and Claude in one
          place. Sign in with GitHub and only you can see, edit or delete your records.
        </p>
        <div className="flex justify-center gap-3">
          <GitHubSignInButton />
          <Button asChild size="lg" variant="outline">
            <Link to="/dashboard">Open dashboard</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <Card key={title}>
            <CardHeader>
              <Icon className="text-muted-foreground mb-2 size-6" aria-hidden="true" />
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">{text}</CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How it works</h2>
        <ol className="text-muted-foreground list-decimal space-y-1 pl-5 text-sm">
          <li>Sign in with GitHub — the server issues a session cookie for you.</li>
          <li>Add a capsule: the prompt, what the AI answered, and how useful it was.</li>
          <li>Come back to review, update or delete your capsules any time.</li>
        </ol>
      </section>
    </div>
  );
}
