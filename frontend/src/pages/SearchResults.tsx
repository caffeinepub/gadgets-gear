import { useMemo } from 'react';
import { useSearch, Link } from '@tanstack/react-router';
import { Search, ArrowLeft } from 'lucide-react';
import { useAllProducts } from '../hooks/useQueries';
import { ProductCard } from '../components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

export function SearchResults() {
  const { q } = useSearch({ from: '/search' });
  const { data: products, isLoading } = useAllProducts();

  const results = useMemo(() => {
    if (!products || !q) return [];
    const query = q.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query)
    );
  }, [products, q]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-gold-400 text-sm transition-colors mb-4">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <div className="flex items-center gap-3">
          <Search size={24} className="text-gold-400" />
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              Search Results
            </h1>
            {q && (
              <p className="text-muted-foreground text-sm">
                {isLoading ? 'Searching...' : `${results.length} result${results.length !== 1 ? 's' : ''} for "${q}"`}
              </p>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-7 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <Search size={48} className="text-muted-foreground mx-auto mb-4 opacity-30" />
          <h2 className="font-display font-bold text-xl text-foreground mb-2">No results found</h2>
          <p className="text-muted-foreground mb-6">
            {q ? `No products match "${q}"` : 'Enter a search term to find products'}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/electronics" className="text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors">
              Browse Electronics
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/watches" className="text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors">
              Browse Watches
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {results.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
