// DELETE: DELETE /api/capsules/:id through the application UI, with confirmation (assignment §7).
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/lib/api';
import { deleteCapsule } from '@/lib/capsules';
import type { Capsule } from '@/types/capsule';

interface Props {
  capsule: Capsule;
  onDeleted: () => void;
  onMissing: () => void;
}

export function DeleteCapsuleDialog({ capsule, onDeleted, onMissing }: Props) {
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    setDeleting(true);
    try {
      await deleteCapsule(capsule.id);
      onDeleted();
      toast.success('Capsule deleted');
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        toast.error('That capsule no longer exists');
        onMissing();
      } else {
        toast.error(err instanceof Error ? err.message : 'Could not delete capsule');
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-destructive">
          <Trash2 aria-hidden="true" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{capsule.prompt_title}”?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the capsule permanently. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
