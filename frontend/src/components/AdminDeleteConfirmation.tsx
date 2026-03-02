import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { useDeleteProduct } from '../hooks/useQueries';
import type { Product } from '../backend';
import { Loader2, Trash2 } from 'lucide-react';

interface AdminDeleteConfirmationProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

export function AdminDeleteConfirmation({ open, onClose, product }: AdminDeleteConfirmationProps) {
  const deleteProduct = useDeleteProduct();

  function handleConfirm() {
    if (!product) return;
    deleteProduct.mutate(product.id, { onSuccess: onClose });
  }

  return (
    <AlertDialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <AlertDialogContent className="bg-surface-2 border-border text-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground font-display flex items-center gap-2">
            <Trash2 size={20} className="text-destructive" />
            Delete Product
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Are you sure you want to delete{' '}
            <span className="text-foreground font-semibold">"{product?.name}"</span>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteProduct.error && (
          <p className="text-destructive text-sm bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2 mx-0">
            {deleteProduct.error.message}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onClose}
            disabled={deleteProduct.isPending}
            className="border-border text-foreground hover:bg-surface-1 bg-transparent"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteProduct.isPending}
            className="bg-destructive hover:bg-destructive/90 text-white font-semibold"
          >
            {deleteProduct.isPending && <Loader2 size={16} className="mr-2 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
