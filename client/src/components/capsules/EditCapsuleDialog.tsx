// UPDATE: PUT /api/capsules/:id through the application UI (assignment §7).
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { CapsuleForm } from '@/components/capsules/CapsuleForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ApiError } from '@/lib/api';
import { updateCapsule } from '@/lib/capsules';
import type { Capsule, CapsuleInput } from '@/types/capsule';

interface Props {
  capsule: Capsule;
  onUpdated: (c: Capsule) => void;
  onMissing: () => void;
}

export function EditCapsuleDialog({ capsule, onUpdated, onMissing }: Props) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(input: CapsuleInput) {
    try {
      const updated = await updateCapsule(capsule.id, input);
      onUpdated(updated);
      setOpen(false);
      toast.success('Capsule updated');
    } catch (err) {
      // The record no longer exists (or is not ours): refresh the list rather than show a stale card.
      if (err instanceof ApiError && err.status === 404) {
        setOpen(false);
        toast.error('That capsule no longer exists');
        onMissing();
        return;
      }
      throw err;
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil aria-hidden="true" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit capsule</DialogTitle>
          <DialogDescription>Update the prompt record.</DialogDescription>
        </DialogHeader>
        {open && (
          <CapsuleForm
            initial={capsule}
            submitLabel="Save changes"
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
