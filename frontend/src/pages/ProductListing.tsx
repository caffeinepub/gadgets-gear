import { useState, useMemo } from 'react';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { useProductsByCategory, Category } from '../hooks/useQueries';
import { ProductCard } from '../components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface ProductListingProps {
  category: 'electronics' | 'watches';
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

const MAX_PRICE = 200000;

function ProductCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-7 w-16" />
        </div>
      </div>
    </div>
  );
}

function FilterPanel({
  brands,
  selectedBrands,
  onBrandToggle,
  priceRange,
  onPriceChange,
  maxPrice,
}: {
  brands: string[];
  selectedBrands: string[];
  onBrandToggle: (brand: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  maxPrice: number;
}) {
  const formatPrice = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val / 100);

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-display font-semibold text-foreground text-sm mb-4">Price Range</h3>
        <Slider
          min={0}
          max={maxPrice}
          step={500}
          value={[priceRange[0], priceRange[1]]}
          onValueChange={(vals) => onPriceChange([vals[0], vals[1]])}
          className="mb-3"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-foreground text-sm mb-3">Brand</h3>
          <div className="space-y-2">
            {brands.map(brand => (
              <div key={brand} className="flex items-center gap-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => onBrandToggle(brand)}
                  className="border-border data-[state=checked]:bg-gold-400 data-[state=checked]:border-gold-400"
                />
                <Label htmlFor={`brand-${brand}`} className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ProductListing({ category }: ProductListingProps) {
  const backendCategory = category === 'electronics' ? Category.electronics : Category.watches;
  const { data: products, isLoading } = useProductsByCategory(backendCategory);

  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);

  const brands = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map(p => p.brand))].sort();
  }, [products]);

  const maxPrice = useMemo(() => {
    if (!products || products.length === 0) return MAX_PRICE;
    return Math.max(...products.map(p => Number(p.price)));
  }, [products]);

  const filteredAndSorted = useMemo(() => {
    if (!products) return [];
    let result = [...products];

    // Filter by brand
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // Filter by price
    result = result.filter(p => {
      const price = Number(p.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedBrands, priceRange, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, maxPrice]);
  };

  const hasActiveFilters = selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < maxPrice;
  const title = category === 'electronics' ? 'Electronics' : 'Watches';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-foreground mb-1">{title}</h1>
        <p className="text-muted-foreground text-sm">
          {isLoading ? 'Loading...' : `${filteredAndSorted.length} products`}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-foreground text-sm">Filters</h2>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1"
                >
                  <X size={12} /> Clear
                </button>
              )}
            </div>
            <FilterPanel
              brands={brands}
              selectedBrands={selectedBrands}
              onBrandToggle={toggleBrand}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              maxPrice={maxPrice}
            />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-5 gap-3">
            {/* Mobile filter */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="lg:hidden flex items-center gap-2 bg-card border border-border rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <SlidersHorizontal size={15} />
                  Filters
                  {hasActiveFilters && (
                    <span className="bg-gold-400 text-surface-1 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {selectedBrands.length + (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0)}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-surface-2 border-border w-72">
                <SheetHeader>
                  <SheetTitle className="font-display text-foreground">Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6 px-1">
                  <FilterPanel
                    brands={brands}
                    selectedBrands={selectedBrands}
                    onBrandToggle={toggleBrand}
                    priceRange={priceRange}
                    onPriceChange={setPriceRange}
                    maxPrice={maxPrice}
                  />
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="mt-6 w-full text-sm text-gold-400 hover:text-gold-300 transition-colors flex items-center justify-center gap-1"
                    >
                      <X size={13} /> Clear All Filters
                    </button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-muted-foreground text-sm hidden sm:block">Sort by:</span>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-44 bg-card border-border text-foreground text-sm h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-surface-2 border-border">
                  <SelectItem value="featured" className="text-foreground hover:text-gold-400">Featured</SelectItem>
                  <SelectItem value="price-asc" className="text-foreground hover:text-gold-400">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc" className="text-foreground hover:text-gold-400">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc" className="text-foreground hover:text-gold-400">Name: A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active filter chips */}
          {selectedBrands.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedBrands.map(brand => (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className="flex items-center gap-1 bg-gold-400/10 border border-gold-400/30 text-gold-400 text-xs px-2.5 py-1 rounded-full hover:bg-gold-400/20 transition-colors"
                >
                  {brand} <X size={11} />
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-2">No products found</p>
              <p className="text-muted-foreground text-sm mb-4">Try adjusting your filters</p>
              <button
                onClick={clearFilters}
                className="text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredAndSorted.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
