import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { CreditCard, MapPin, Lock } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

const initialForm: FormData = {
  firstName: '', lastName: '', email: '',
  address: '', city: '', postalCode: '', country: '',
  cardHolder: '', cardNumber: '', expiry: '', cvv: '',
};

export function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const shipping = subtotal >= 10000 ? 0 : 999;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="font-display font-bold text-2xl text-foreground mb-4">Your cart is empty</h2>
        <Link to="/" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
          Return to Home
        </Link>
      </main>
    );
  }

  const update = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    const required: (keyof FormData)[] = ['firstName', 'lastName', 'email', 'address', 'city', 'postalCode', 'country', 'cardHolder', 'cardNumber', 'expiry', 'cvv'];
    required.forEach(field => {
      if (!form[field].trim()) newErrors[field] = 'Required';
    });
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    clearCart();
    navigate({ to: '/checkout/confirmation' });
  };

  const formatCardNumber = (val: string) => {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display font-bold text-3xl text-foreground mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-5">
                <MapPin size={18} className="text-gold-400" />
                <h2 className="font-display font-semibold text-foreground text-lg">Shipping Address</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs mb-1.5 block">First Name *</Label>
                  <Input
                    value={form.firstName}
                    onChange={update('firstName')}
                    className={`bg-surface-3 border-border text-foreground placeholder:text-muted-foreground focus:border-gold-400 ${errors.firstName ? 'border-destructive' : ''}`}
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-destructive text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs mb-1.5 block">Last Name *</Label>
                  <Input
                    value={form.lastName}
                    onChange={update('lastName')}
                    className={`bg-surface-3 border-border text-foreground placeholder:text-muted-foreground focus:border-gold-400 ${errors.lastName ? 'border-destructive' : ''}`}
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="text-destructive text-xs mt-1">{errors.lastName}</p>}
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-muted-foreground text-xs mb-1.5 block">Email *</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    className={`bg-surface-3 border-border text-foreground placeholder:text-muted-foreground focus:border-gold-400 ${errors.email ? 'border-destructive' : ''}`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-muted-foreground text-xs mb-1.5 block">Address *</Label>
                  <Input
                    value={form.address}
                    onChange={update('address')}
                    className={`bg-surface-3 border-border text-foreground placeholder:text-muted-foreground focus:border-gold-400 ${errors.address ? 'border-destructive' : ''}`}
                    placeholder="123 Main Street"
                  />
                  {errors.address && <p className="text-destructive text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs mb-1.5 block">City *</Label>
                  <Input
                    value={form.city}
                    onChange={update('city')}
                    className={`bg-surface-3 border-border text-foreground placeholder:text-muted-foreground focus:border-gold-400 ${errors.city ? 'border-destructive' : ''}`}
                    placeholder="New York"
                  />
                  {errors.city && <p className="text-destructive text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs mb-1.5 block">Postal Code *</Label>
                  <Input
                    value={form.postalCode}
                    onChange={update('postalCode')}
                    className={`bg-surface-3 border-border text-foreground placeholder:text-muted-foreground focus:border-gold-400 ${errors.postalCode ? 'border-destructive' : ''}`}
                    placeholder="10001"
                  />
                  {errors.postalCode && <p className="text-destructive text-xs mt-1">{errors.postalCode}</p>}
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-muted-foreground text-xs mb-1.5 block">Country *</Label>
                  <Input
                    value={form.country}
                    onChange={update('country')}
                    className={`bg-surface-3 border-border text-foreground placeholder:text-muted-foreground focus:border-gold-400 ${errors.country ? 'border-destructive' : ''}`}
                    placeholder="United States"
                  />
                  {errors.country && <p className="text-destructive text-xs mt-1">{errors.country}</p>}
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard size={18} className="text-gold-400" />
                <h2 className="font-display font-semibold text-foreground text-lg">Payment Information</h2>
                <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                  <Lock size={12} className="text-green-500" />
                  <span>Secure</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label className="text-muted-foreground text-xs mb-1.5 block">Card Holder Name *</Label>
                  <Input
                    value={form.cardHolder}
                    onChange={update('cardHolder')}
                    className={`bg-surface-3 border-border text-foreground placeholder:text-muted-foreground focus:border-gold-400 ${errors.cardHolder ? 'border-destructive' : ''}`}
                    placeholder="John Doe"
                  />
                  {errors.cardHolder && <p className="text-destructive text-xs mt-1">{errors.cardHolder}</p>}
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-muted-foreground text-xs mb-1.5 block">Card Number *</Label>
                  <Input
                    value={form.cardNumber}
                    onChange={e => setForm(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                    className={`bg-surface-3 border-border text-foreground placeholder:text-muted-foreground focus:border-gold-400 font-mono ${errors.cardNumber ? 'border-destructive' : ''}`}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  {errors.cardNumber && <p className="text-destructive text-xs mt-1">{errors.cardNumber}</p>}
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs mb-1.5 block">Expiry Date *</Label>
                  <Input
                    value={form.expiry}
                    onChange={e => setForm(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                    className={`bg-surface-3 border-border text-foreground placeholder:text-muted-foreground focus:border-gold-400 font-mono ${errors.expiry ? 'border-destructive' : ''}`}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  {errors.expiry && <p className="text-destructive text-xs mt-1">{errors.expiry}</p>}
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs mb-1.5 block">CVV *</Label>
                  <Input
                    value={form.cvv}
                    onChange={e => setForm(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    className={`bg-surface-3 border-border text-foreground placeholder:text-muted-foreground focus:border-gold-400 font-mono ${errors.cvv ? 'border-destructive' : ''}`}
                    placeholder="123"
                    maxLength={4}
                  />
                  {errors.cvv && <p className="text-destructive text-xs mt-1">{errors.cvv}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-5 sticky top-24">
              <h2 className="font-display font-semibold text-foreground text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-md bg-surface-3 shrink-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://placehold.co/48x48/1a1a2e/f59e0b?text=${encodeURIComponent(item.name[0])}&font=montserrat`;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-xs font-medium line-clamp-1">{item.name}</p>
                      <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-gold-400 text-sm font-semibold shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="bg-border mb-3" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-500' : 'text-foreground'}>
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                <Separator className="bg-border" />
                <div className="flex justify-between font-display font-bold text-base">
                  <span className="text-foreground">Total</span>
                  <span className="text-gold-400">{formatPrice(total)}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-5 flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-300 disabled:opacity-60 disabled:cursor-not-allowed text-surface-1 font-semibold py-3 rounded-md transition-colors"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <Lock size={15} />
                    Place Order · {formatPrice(total)}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
