import { useState } from 'react';
import { Link, useNavigate, useRouter } from '@tanstack/react-router';
import { ShoppingCart, Search, Menu, X, Zap } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: '/search', search: { q: searchQuery.trim() } });
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-surface-1 border-b border-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 bg-gold-400 rounded-md flex items-center justify-center group-hover:bg-gold-300 transition-colors">
              <Zap size={18} className="text-surface-1" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-lg text-foreground hidden sm:block">
              Gadgets<span className="text-gold-400">Gear</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/electronics"
              className="text-sm font-medium text-muted-foreground hover:text-gold-400 transition-colors"
            >
              Electronics
            </Link>
            <Link
              to="/watches"
              className="text-sm font-medium text-muted-foreground hover:text-gold-400 transition-colors"
            >
              Watches
            </Link>
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:flex">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-surface-3 border border-border rounded-md pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold-400 focus:border-gold-400 transition-colors"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-muted-foreground hover:text-gold-400 transition-colors">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold-400 text-surface-1 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3 animate-fade-in">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="sm:hidden">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-surface-3 border border-border rounded-md pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold-400"
                />
              </div>
            </form>
            <nav className="flex flex-col gap-2">
              <Link
                to="/electronics"
                className="text-sm font-medium text-muted-foreground hover:text-gold-400 transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Electronics
              </Link>
              <Link
                to="/watches"
                className="text-sm font-medium text-muted-foreground hover:text-gold-400 transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Watches
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
