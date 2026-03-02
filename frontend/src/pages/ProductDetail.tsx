import { useState } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { ShoppingCart, ArrowLeft, Package, CheckCircle, AlertCircle, Minus, Plus } from 'lucide-react';
import { useProductById } from '../hooks/useQueries';
import { useCart } from '../contexts/CartContext';
import { formatPrice, getProductImageUrl } from '../lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export function ProductDetail() {
  const { id } = useParams({ from: '/product/$id' });
  const { data: product, isLoading, error } = useProductById(id);
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const cartItem = items.find(i => i.id === id);
  const inStock = product ? Number(product.stock) > 0 : false;

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        imageUrl: getProductImageUrl(product.imageUrl, product.name),
        brand: product.brand,
      });
    }
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Skeleton className="h-5 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <AlertCircle size={48} className="text-muted-foreground mx-auto mb-4" />
        <h2 className="font-display font-bold text-2xl text-foreground mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
          Return to Home
        </Link>
      </main>
    );
  }

  const imageUrl = getProductImageUrl(product.imageUrl, product.name);
  const categoryLabel = product.category === 'electronics' ? 'Electronics' : 'Watches';
  const categoryPath = product.category === 'electronics' ? '/electronics' : '/watches';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
        <span>/</span>
        <Link to={categoryPath} className="hover:text-gold-400 transition-colors">{categoryLabel}</Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden bg-surface-3 border border-border">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://placehold.co/600x600/1a1a2e/f59e0b?text=${encodeURIComponent(product.name)}&font=montserrat`;
              }}
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          {/* Brand & Category */}
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-gold-400/10 text-gold-400 border border-gold-400/30 font-semibold text-xs">
              {product.brand}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {categoryLabel}
            </Badge>
          </div>

          <h1 className="font-display font-bold text-3xl text-foreground mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mb-5">
            <span className="font-display font-bold text-4xl text-gold-400">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 mb-6">
            {inStock ? (
              <>
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-green-500 text-sm font-medium">
                  In Stock ({Number(product.stock)} available)
                </span>
              </>
            ) : (
              <>
                <AlertCircle size={16} className="text-destructive" />
                <span className="text-destructive text-sm font-medium">Out of Stock</span>
              </>
            )}
          </div>

          {/* Description */}
          <div className="bg-surface-3 rounded-lg p-4 mb-6 border border-border">
            <h3 className="font-display font-semibold text-foreground text-sm mb-2">Description</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
          </div>

          {/* Quantity + Add to Cart */}
          {inStock && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground font-medium">Quantity:</span>
                <div className="flex items-center border border-border rounded-md overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 py-2 text-foreground font-semibold text-sm min-w-[3rem] text-center border-x border-border">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(Number(product.stock), q + 1))}
                    className="px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-md transition-all ${
                  addedFeedback
                    ? 'bg-green-600 text-white'
                    : 'bg-gold-400 hover:bg-gold-300 text-surface-1'
                }`}
              >
                {addedFeedback ? (
                  <>
                    <CheckCircle size={18} />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    Add to Cart
                    {cartItem && <span className="text-xs opacity-75">({cartItem.quantity} in cart)</span>}
                  </>
                )}
              </button>
            </div>
          )}

          {/* Product Info */}
          <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package size={15} className="text-gold-400" />
              <span>Free shipping over $100</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle size={15} className="text-gold-400" />
              <span>2-year warranty</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
