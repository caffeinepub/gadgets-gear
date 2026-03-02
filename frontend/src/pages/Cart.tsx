import { Link, useNavigate } from '@tanstack/react-router';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../lib/utils';
import { Separator } from '@/components/ui/separator';

export function Cart() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <ShoppingBag size={64} className="text-muted-foreground mx-auto mb-6 opacity-40" />
        <h2 className="font-display font-bold text-2xl text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Add some products to get started</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-surface-1 font-semibold px-6 py-3 rounded-md transition-colors"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  const shipping = subtotal >= 10000 ? 0 : 999;
  const total = subtotal + shipping;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display font-bold text-3xl text-foreground mb-8">
        Shopping Cart
        <span className="text-muted-foreground font-normal text-lg ml-3">({totalItems} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-card border border-border rounded-lg p-4 flex gap-4">
              <Link to="/product/$id" params={{ id: item.id }} className="shrink-0">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md bg-surface-3"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://placehold.co/80x80/1a1a2e/f59e0b?text=${encodeURIComponent(item.name[0])}&font=montserrat`;
                  }}
                />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      to="/product/$id"
                      params={{ id: item.id }}
                      className="font-display font-semibold text-foreground text-sm hover:text-gold-400 transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-muted-foreground text-xs mt-0.5">{item.brand}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors shrink-0 p-1"
                    aria-label="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-border rounded-md overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-3 py-1.5 text-foreground text-sm font-semibold border-x border-border min-w-[2.5rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  {/* Line total */}
                  <div className="text-right">
                    <p className="text-gold-400 font-display font-bold text-base">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <p className="text-muted-foreground text-xs">{formatPrice(item.price)} each</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-5 sticky top-24">
            <h2 className="font-display font-semibold text-foreground text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({totalItems} items)</span>
                <span className="text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-500 font-medium' : 'text-foreground'}>
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Add {formatPrice(10000 - subtotal)} more for free shipping
                </p>
              )}
              <Separator className="bg-border" />
              <div className="flex justify-between font-display font-bold text-base">
                <span className="text-foreground">Total</span>
                <span className="text-gold-400">{formatPrice(total)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate({ to: '/checkout' })}
              className="w-full mt-5 flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-300 text-surface-1 font-semibold py-3 rounded-md transition-colors"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>
            <Link
              to="/"
              className="block text-center mt-3 text-sm text-muted-foreground hover:text-gold-400 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
