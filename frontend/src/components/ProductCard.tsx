import { Link } from '@tanstack/react-router';
import { ShoppingCart } from 'lucide-react';
import { type Product } from '../backend';
import { useCart } from '../contexts/CartContext';
import { formatPrice, getProductImageUrl } from '../lib/utils';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: getProductImageUrl(product.imageUrl, product.name),
      brand: product.brand,
    });
  };

  const inStock = Number(product.stock) > 0;

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group block"
    >
      <div className="bg-card border border-border rounded-lg overflow-hidden card-hover shadow-card flex flex-col h-full">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/3] bg-surface-3">
          <img
            src={getProductImageUrl(product.imageUrl, product.name)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://placehold.co/600x400/1a1a2e/f59e0b?text=${encodeURIComponent(product.name)}&font=montserrat`;
            }}
          />
          {!inStock && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm font-semibold">Out of Stock</Badge>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge className="bg-gold-400 text-surface-1 font-semibold text-xs border-0">
              {product.brand}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-display font-semibold text-foreground text-sm leading-tight mb-1 line-clamp-2 group-hover:text-gold-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-xs line-clamp-2 mb-3 flex-1">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-gold-400 font-display font-bold text-lg">
              {formatPrice(product.price)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex items-center gap-1.5 bg-gold-400 hover:bg-gold-300 disabled:opacity-40 disabled:cursor-not-allowed text-surface-1 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
            >
              <ShoppingCart size={13} />
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
