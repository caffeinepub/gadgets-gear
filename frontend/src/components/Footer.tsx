import { Link } from '@tanstack/react-router';
import { Zap, Heart } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'gadgets-gear');

  return (
    <footer className="bg-surface-2 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gold-400 rounded-md flex items-center justify-center">
                <Zap size={18} className="text-surface-1" fill="currentColor" />
              </div>
              <span className="font-display font-bold text-lg text-foreground">
                Gadgets<span className="text-gold-400">Gear</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Your premier destination for cutting-edge electronics and premium timepieces. Quality gear for the modern lifestyle.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display font-semibold text-foreground text-sm mb-3">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/electronics" className="text-muted-foreground hover:text-gold-400 text-sm transition-colors">Electronics</Link></li>
              <li><Link to="/watches" className="text-muted-foreground hover:text-gold-400 text-sm transition-colors">Watches</Link></li>
              <li><Link to="/cart" className="text-muted-foreground hover:text-gold-400 text-sm transition-colors">Cart</Link></li>
            </ul>
          </div>

          {/* Info + Store Management */}
          <div className="space-y-6">
            <div>
              <h4 className="font-display font-semibold text-foreground text-sm mb-3">Info</h4>
              <ul className="space-y-2">
                <li><span className="text-muted-foreground text-sm">Free Shipping Over $100</span></li>
                <li><span className="text-muted-foreground text-sm">30-Day Returns</span></li>
                <li><span className="text-muted-foreground text-sm">2-Year Warranty</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground text-sm mb-3">Store Management</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/admin"
                    className="text-muted-foreground hover:text-gold-400 text-sm transition-colors"
                  >
                    Admin Panel
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs">
            © {year} GadgetsGear. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs flex items-center gap-1">
            Built with <Heart size={12} className="text-gold-400 fill-gold-400" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 hover:text-gold-300 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
