import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddProduct, useUpdateProduct, Category } from '../hooks/useQueries';
import type { Product, NewProduct, UpdateProduct } from '../backend';
import { Loader2 } from 'lucide-react';

interface AdminProductFormProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}

function generateId(): string {
  return `prod_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function AdminProductForm({ open, onClose, product }: AdminProductFormProps) {
  const isEdit = !!product;
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>(Category.electronics);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stock, setStock] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category === Category.watches ? Category.watches : Category.electronics);
      setDescription(product.description);
      setPrice(String(Number(product.price)));
      setBrand(product.brand);
      setImageUrl(product.imageUrl);
      setStock(String(Number(product.stock)));
    } else {
      setName('');
      setCategory(Category.electronics);
      setDescription('');
      setPrice('');
      setBrand('');
      setImageUrl('');
      setStock('');
    }
    setErrors({});
  }, [product, open]);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!brand.trim()) newErrors.brand = 'Brand is required';
    if (!price.trim() || isNaN(Number(price)) || Number(price) < 0) newErrors.price = 'Valid price is required (in cents)';
    if (!stock.trim() || isNaN(Number(stock)) || !Number.isInteger(Number(stock)) || Number(stock) < 0) newErrors.stock = 'Valid stock quantity is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    if (isEdit && product) {
      const payload: UpdateProduct = {
        id: product.id,
        name: name.trim(),
        category,
        description: description.trim(),
        price: BigInt(Math.round(Number(price))),
        brand: brand.trim(),
        imageUrl: imageUrl.trim(),
        stock: BigInt(Math.round(Number(stock))),
      };
      updateProduct.mutate(payload, { onSuccess: onClose });
    } else {
      const id = generateId();
      const payload: NewProduct = {
        name: name.trim(),
        category,
        description: description.trim(),
        price: BigInt(Math.round(Number(price))),
        brand: brand.trim(),
        imageUrl: imageUrl.trim(),
        stock: BigInt(Math.round(Number(stock))),
      };
      addProduct.mutate({ id, productInfo: payload }, { onSuccess: onClose });
    }
  }

  const isPending = addProduct.isPending || updateProduct.isPending;
  const mutationError = addProduct.error || updateProduct.error;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="bg-surface-2 border-border text-foreground max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gold-400 font-display text-xl">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Name */}
          <div className="space-y-1">
            <Label htmlFor="name" className="text-foreground text-sm">Product Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sony WH-1000XM5"
              className="bg-surface-1 border-border text-foreground placeholder:text-muted-foreground focus:border-gold-400"
            />
            {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
          </div>

          {/* Brand */}
          <div className="space-y-1">
            <Label htmlFor="brand" className="text-foreground text-sm">Brand *</Label>
            <Input
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Sony"
              className="bg-surface-1 border-border text-foreground placeholder:text-muted-foreground focus:border-gold-400"
            />
            {errors.brand && <p className="text-destructive text-xs">{errors.brand}</p>}
          </div>

          {/* Category */}
          <div className="space-y-1">
            <Label className="text-foreground text-sm">Category *</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger className="bg-surface-1 border-border text-foreground focus:border-gold-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-surface-2 border-border text-foreground">
                <SelectItem value={Category.electronics} className="focus:bg-surface-1 focus:text-gold-400">Electronics</SelectItem>
                <SelectItem value={Category.watches} className="focus:bg-surface-1 focus:text-gold-400">Watches</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description" className="text-foreground text-sm">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product description..."
              rows={3}
              className="bg-surface-1 border-border text-foreground placeholder:text-muted-foreground focus:border-gold-400 resize-none"
            />
            {errors.description && <p className="text-destructive text-xs">{errors.description}</p>}
          </div>

          {/* Price */}
          <div className="space-y-1">
            <Label htmlFor="price" className="text-foreground text-sm">Price (in cents) *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 29999 for $299.99"
              className="bg-surface-1 border-border text-foreground placeholder:text-muted-foreground focus:border-gold-400"
            />
            {errors.price && <p className="text-destructive text-xs">{errors.price}</p>}
            {price && !isNaN(Number(price)) && (
              <p className="text-muted-foreground text-xs">
                Display price: ${(Number(price) / 100).toFixed(2)}
              </p>
            )}
          </div>

          {/* Stock */}
          <div className="space-y-1">
            <Label htmlFor="stock" className="text-foreground text-sm">Stock Quantity *</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              step="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="e.g. 50"
              className="bg-surface-1 border-border text-foreground placeholder:text-muted-foreground focus:border-gold-400"
            />
            {errors.stock && <p className="text-destructive text-xs">{errors.stock}</p>}
          </div>

          {/* Image URL */}
          <div className="space-y-1">
            <Label htmlFor="imageUrl" className="text-foreground text-sm">Image URL</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="bg-surface-1 border-border text-foreground placeholder:text-muted-foreground focus:border-gold-400"
            />
          </div>

          {mutationError && (
            <p className="text-destructive text-sm bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2">
              {mutationError.message}
            </p>
          )}

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="border-border text-foreground hover:bg-surface-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-gold-400 hover:bg-gold-500 text-surface-1 font-semibold"
            >
              {isPending && <Loader2 size={16} className="mr-2 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Add Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
