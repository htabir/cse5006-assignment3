// One form for create and edit. There is deliberately no user_id field — the server takes the
// owner from the verified JWT (assignment §9).
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ApiError } from '@/lib/api';
import { CATEGORIES, USEFULNESS, type Capsule, type CapsuleInput } from '@/types/capsule';

const EMPTY: CapsuleInput = {
  project_name: '',
  prompt_title: '',
  prompt_version: '',
  prompt_text: '',
  response_summary: '',
  category: null,
  usefulness: null,
  reviewed: false,
  improved: false,
  screenshot_url: '',
  notes: '',
};

type FieldErrors = Partial<Record<keyof CapsuleInput, string>>;

function toInput(capsule: Capsule): CapsuleInput {
  const { id: _id, user_id: _user, created_at: _created, ...input } = capsule;
  return {
    ...input,
    prompt_version: input.prompt_version ?? '',
    response_summary: input.response_summary ?? '',
    screenshot_url: input.screenshot_url ?? '',
    notes: input.notes ?? '',
  };
}

// Map zod issues from a 400 response onto the field they belong to.
function fieldErrorsFrom(err: unknown): FieldErrors {
  if (!(err instanceof ApiError) || !Array.isArray(err.issues)) return {};
  const errors: FieldErrors = {};
  for (const issue of err.issues as { path?: unknown[]; message?: string }[]) {
    const field = issue.path?.[0];
    if (typeof field === 'string' && issue.message)
      errors[field as keyof CapsuleInput] = issue.message;
  }
  return errors;
}

interface Props {
  initial?: Capsule;
  submitLabel: string;
  onSubmit: (input: CapsuleInput) => Promise<void>;
  onCancel: () => void;
}

export function CapsuleForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const [values, setValues] = useState<CapsuleInput>(initial ? toInput(initial) : EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof CapsuleInput>(key: K, value: CapsuleInput[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (!values.project_name.trim()) e.project_name = 'Project name is required';
    if (!values.prompt_title.trim()) e.prompt_title = 'Prompt title is required';
    if (!values.prompt_text.trim()) e.prompt_text = 'Prompt text is required';
    return e;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const clientErrors = validate();
    setErrors(clientErrors);
    setFormError(null);
    if (Object.keys(clientErrors).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      const fieldErrors = fieldErrorsFrom(err);
      setErrors(fieldErrors);
      if (Object.keys(fieldErrors).length === 0) {
        setFormError(err instanceof Error ? err.message : 'Something went wrong');
      }
    } finally {
      setSubmitting(false);
    }
  }

  const error = (key: keyof CapsuleInput) =>
    errors[key] ? (
      <p className="text-destructive text-xs" id={`${key}-error`}>
        {errors[key]}
      </p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="project_name">Project name *</Label>
          <Input
            id="project_name"
            value={values.project_name}
            onChange={(e) => set('project_name', e.target.value)}
            aria-invalid={!!errors.project_name}
            placeholder="SmartFarm Irrigation"
          />
          {error('project_name')}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="prompt_version">Prompt version</Label>
          <Input
            id="prompt_version"
            value={values.prompt_version ?? ''}
            onChange={(e) => set('prompt_version', e.target.value)}
            placeholder="v1"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="prompt_title">Prompt title *</Label>
        <Input
          id="prompt_title"
          value={values.prompt_title}
          onChange={(e) => set('prompt_title', e.target.value)}
          aria-invalid={!!errors.prompt_title}
          placeholder="Debug cloud deployment"
        />
        {error('prompt_title')}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="prompt_text">Prompt text *</Label>
        <Textarea
          id="prompt_text"
          rows={5}
          value={values.prompt_text}
          onChange={(e) => set('prompt_text', e.target.value)}
          aria-invalid={!!errors.prompt_text}
          placeholder="Why does my Node server fail?"
        />
        {error('prompt_text')}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="response_summary">Response summary</Label>
        <Textarea
          id="response_summary"
          rows={3}
          value={values.response_summary ?? ''}
          onChange={(e) => set('response_summary', e.target.value)}
          placeholder="Check start command"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="category">Category</Label>
          <Select value={values.category ?? ''} onValueChange={(v) => set('category', v || null)}>
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="usefulness">Usefulness</Label>
          <Select
            value={values.usefulness ?? ''}
            onValueChange={(v) => set('usefulness', v || null)}
          >
            <SelectTrigger id="usefulness" className="w-full">
              <SelectValue placeholder="Rate the response" />
            </SelectTrigger>
            <SelectContent>
              {USEFULNESS.map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <Checkbox
            id="reviewed"
            checked={values.reviewed}
            onCheckedChange={(c) => set('reviewed', c === true)}
          />
          <Label htmlFor="reviewed">Response reviewed</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="improved"
            checked={values.improved}
            onCheckedChange={(c) => set('improved', c === true)}
          />
          <Label htmlFor="improved">Output improved</Label>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="screenshot_url">Screenshot URL</Label>
        <Input
          id="screenshot_url"
          type="url"
          value={values.screenshot_url ?? ''}
          onChange={(e) => set('screenshot_url', e.target.value)}
          aria-invalid={!!errors.screenshot_url}
          placeholder="https://..."
        />
        {error('screenshot_url')}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          rows={2}
          value={values.notes ?? ''}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Tested and worked"
        />
      </div>

      {formError && (
        <p className="text-destructive text-sm" role="alert">
          {formError}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
