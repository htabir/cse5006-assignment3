// CREATE: POST /api/capsules through the application UI (assignment §7).
import { Plus } from 'lucide-react';
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
import { createCapsule } from '@/lib/capsules';
import type { CapsuleInput } from '@/types/capsule';

export function CreateCapsuleDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(input: CapsuleInput) {
    await createCapsule(input);
    onCreated();
    setOpen(false);
    toast.success('Capsule saved');
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus aria-hidden="true" />
          New capsule
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>New capsule</DialogTitle>
          <DialogDescription>Save a prompt and how well it worked.</DialogDescription>
        </DialogHeader>
        {open && (
          <CapsuleForm
            submitLabel="Save capsule"
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
