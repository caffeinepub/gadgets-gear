import { Link } from '@tanstack/react-router';
import { ArrowRight, Zap, Shield, Truck, RotateCcw } from 'lucide-react';
import { useAllProducts } from '../hooks/useQueries';
import { ProductCard } from '../components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

function ProductCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex justify-between items-center pt-1">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-7 w-16" />
        </div>
      </div>
    </div>
  );
}

export function Home() {
  const { data: products, isLoading } = useAllProducts();

  const featuredProducts = products?.slice(0, 4) ?? [];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[520px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/generated/hero-banner-bg.dim_1440x600.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-1/95 via-surface-1/80 to-surface-1/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-gold-400/10 border border-gold-400/30 rounded-full px-3 py-1 mb-6">
              <Zap size={12} className="text-gold-400" fill="currentColor" />
              <span className="text-gold-400 text-xs font-semibold tracking-wide uppercase">New Arrivals 2026</span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight mb-4">
              Next-Gen Gear,<br />
              <span className="text-gradient-gold">Timeless Style</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Discover premium electronics and luxury watches curated for the modern tech enthusiast.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/electronics"
                className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-surface-1 font-semibold px-6 py-3 rounded-md transition-colors"
              >
                Shop Electronics
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/watches"
                className="inline-flex items-center gap-2 bg-transparent border border-border hover:border-gold-400 text-foreground hover:text-gold-400 font-semibold px-6 py-3 rounded-md transition-colors"
              >
                Browse Watches
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-surface-2 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, label: 'Free Shipping', sub: 'On orders over $100' },
              { icon: Shield, label: '2-Year Warranty', sub: 'On all products' },
              { icon: RotateCcw, label: '30-Day Returns', sub: 'Hassle-free returns' },
              { icon: Zap, label: 'Fast Delivery', sub: '2-3 business days' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gold-400/10 rounded-md flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-semibold">{label}</p>
                  <p className="text-muted-foreground text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl text-foreground mb-2">Shop by Category</h2>
          <p className="text-muted-foreground">Explore our curated collections</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Electronics */}
          <Link to="/electronics" className="group relative overflow-hidden rounded-xl aspect-[3/2] block">
            <img
              src="/assets/generated/category-electronics.dim_600x400.png"
              alt="Electronics"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-1/90 via-surface-1/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <p className="text-gold-400 text-xs font-semibold uppercase tracking-widest mb-1">Category</p>
              <h3 className="font-display font-bold text-2xl text-foreground mb-2">Electronics</h3>
              <span className="inline-flex items-center gap-1.5 text-sm text-foreground/80 group-hover:text-gold-400 transition-colors font-medium">
                Shop Now <ArrowRight size={14} />
              </span>
            </div>
          </Link>

          {/* Watches */}
          <Link to="/watches" className="group relative overflow-hidden rounded-xl aspect-[3/2] block">
            <img
              src="/assets/generated/category-watches.dim_600x400.png"
              alt="Watches"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-1/90 via-surface-1/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <p className="text-gold-400 text-xs font-semibold uppercase tracking-widest mb-1">Category</p>
              <h3 className="font-display font-bold text-2xl text-foreground mb-2">Watches</h3>
              <span className="inline-flex items-center gap-1.5 text-sm text-foreground/80 group-hover:text-gold-400 transition-colors font-medium">
                Shop Now <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-3xl text-foreground mb-1">Featured Products</h2>
            <p className="text-muted-foreground text-sm">Handpicked top picks for you</p>
          </div>
          <Link
            to="/electronics"
            className="hidden sm:inline-flex items-center gap-1.5 text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-gold-800/30 via-gold-700/20 to-gold-800/30 border-y border-gold-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h2 className="font-display font-bold text-3xl text-foreground mb-3">
            Ready to Upgrade Your Gear?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Browse our full catalog of premium electronics and luxury watches.
          </p>
          <Link
            to="/electronics"
            className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-surface-1 font-semibold px-8 py-3 rounded-md transition-colors"
          >
            Explore All Products <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
