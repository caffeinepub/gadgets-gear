import { Link } from '@tanstack/react-router';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';

export function CheckoutConfirmation() {
  const orderNumber = `GG-${Date.now().toString().slice(-8)}`;

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-green-500" />
      </div>

      <h1 className="font-display font-bold text-3xl text-foreground mb-3">
        Order Confirmed!
      </h1>
      <p className="text-muted-foreground text-lg mb-2">
        Thank you for your purchase.
      </p>
      <p className="text-muted-foreground text-sm mb-8">
        Your order <span className="text-gold-400 font-semibold">{orderNumber}</span> has been placed successfully.
        You'll receive a confirmation email shortly.
      </p>

      {/* Order Details Card */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8 text-left">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gold-400/10 rounded-lg flex items-center justify-center">
            <Package size={20} className="text-gold-400" />
          </div>
          <div>
            <p className="font-display font-semibold text-foreground text-sm">What's Next?</p>
            <p className="text-muted-foreground text-xs">Your order is being processed</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { step: '1', label: 'Order Confirmed', desc: 'Your order has been received', done: true },
            { step: '2', label: 'Processing', desc: 'We\'re preparing your items', done: false },
            { step: '3', label: 'Shipped', desc: 'Your order is on its way', done: false },
            { step: '4', label: 'Delivered', desc: 'Enjoy your new gear!', done: false },
          ].map(({ step, label, desc, done }) => (
            <div key={step} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                done ? 'bg-green-500 text-white' : 'bg-surface-3 text-muted-foreground border border-border'
              }`}>
                {done ? <CheckCircle size={14} /> : step}
              </div>
              <div>
                <p className={`text-sm font-medium ${done ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-300 text-surface-1 font-semibold px-6 py-3 rounded-md transition-colors"
        >
          <Home size={16} />
          Back to Home
        </Link>
        <Link
          to="/electronics"
          className="inline-flex items-center justify-center gap-2 bg-transparent border border-border hover:border-gold-400 text-foreground hover:text-gold-400 font-semibold px-6 py-3 rounded-md transition-colors"
        >
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}
