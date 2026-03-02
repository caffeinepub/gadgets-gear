import { useState } from 'react';
import { useAllProducts } from '../hooks/useQueries';
import { AdminProductForm } from './AdminProductForm';
import { AdminDeleteConfirmation } from './AdminDeleteConfirmation';
import type { Product } from '../backend';
import { Category } from '../backend';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { formatPrice } from '../lib/utils';

export function AdminProductTable() {
  const { data: products, isLoading, error } = useAllProducts();
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  function handleEdit(product: Product) {
    setEditProduct(product);
    setFormOpen(true);
  }

  function handleDelete(product: Product) {
    setDeleteProduct(product);
    setDeleteOpen(true);
  }

  function handleAddNew() {
    setEditProduct(null);
    setFormOpen(true);
  }

  function handleFormClose() {
    setFormOpen(false);
    setEditProduct(null);
  }

  function handleDeleteClose() {
    setDeleteOpen(false);
    setDeleteProduct(null);
  }

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package size={20} className="text-gold-400" />
          <h2 className="font-display font-semibold text-foreground text-lg">
            Products
            {products && (
              <span className="ml-2 text-muted-foreground text-sm font-normal">
                ({products.length})
              </span>
            )}
          </h2>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-gold-400 hover:bg-gold-500 text-surface-1 font-semibold gap-2"
        >
          <Plus size={16} />
          Add Product
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 text-destructive text-sm">
          Failed to load products: {error.message}
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-1 hover:bg-surface-1 border-border">
              <TableHead className="text-muted-foreground font-semibold">Name</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Brand</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Category</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">Price</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">Stock</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-border">
                  <TableCell><Skeleton className="h-4 w-40 bg-surface-1" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24 bg-surface-1" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 bg-surface-1" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16 bg-surface-1 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12 bg-surface-1 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 bg-surface-1 ml-auto" /></TableCell>
                </TableRow>
              ))
            )}
            {!isLoading && products && products.length === 0 && (
              <TableRow className="border-border">
                <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                  No products yet. Click "Add Product" to get started.
                </TableCell>
              </TableRow>
            )}
            {!isLoading && products && products.map((product) => (
              <TableRow
                key={product.id}
                className="border-border hover:bg-surface-1/50 transition-colors"
              >
                <TableCell className="text-foreground font-medium max-w-[200px] truncate">
                  {product.name}
                </TableCell>
                <TableCell className="text-muted-foreground">{product.brand}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      product.category === Category.electronics
                        ? 'border-gold-400/50 text-gold-400 bg-gold-400/10'
                        : 'border-blue-400/50 text-blue-400 bg-blue-400/10'
                    }
                  >
                    {product.category === Category.electronics ? 'Electronics' : 'Watches'}
                  </Badge>
                </TableCell>
                <TableCell className="text-foreground text-right font-mono">
                  {formatPrice(product.price)}
                </TableCell>
                <TableCell className="text-right">
                  <span className={Number(product.stock) === 0 ? 'text-destructive' : Number(product.stock) < 5 ? 'text-yellow-400' : 'text-green-400'}>
                    {Number(product.stock)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product)}
                      className="border-border text-foreground hover:bg-surface-1 hover:text-gold-400 hover:border-gold-400/50 h-8 w-8 p-0"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product)}
                      className="border-border text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 h-8 w-8 p-0"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      <AdminProductForm
        open={formOpen}
        onClose={handleFormClose}
        product={editProduct}
      />
      <AdminDeleteConfirmation
        open={deleteOpen}
        onClose={handleDeleteClose}
        product={deleteProduct}
      />
    </div>
  );
}
