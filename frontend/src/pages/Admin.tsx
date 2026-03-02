import { useState, useEffect } from 'react';
import { useVerifyAdmin } from '../hooks/useQueries';
import { AdminProductTable } from '../components/AdminProductTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, LogOut, ShieldCheck, Loader2, Eye, EyeOff, Info } from 'lucide-react';

const ADMIN_SESSION_KEY = 'gadgets_gear_admin_session';

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const verifyAdmin = useVerifyAdmin();

  // Check persisted session on mount
  useEffect(() => {
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (session === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    verifyAdmin.mutate(
      { password },
      {
        onSuccess: (isValid) => {
          if (isValid) {
            localStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
            setIsAuthenticated(true);
          } else {
            setAuthError('Invalid password. Please try again.');
          }
        },
        onError: (err) => {
          setAuthError(`Authentication failed: ${err.message}`);
        },
      }
    );
  }

  function handleLogout() {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
    setPassword('');
    setAuthError('');
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-background">
        <div className="w-full max-w-md">
          {/* Logo / Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-gold-400 rounded-xl flex items-center justify-center mb-4 shadow-gold">
              <Zap size={28} className="text-surface-1" fill="currentColor" />
            </div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              Gadgets<span className="text-gold-400">Gear</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Admin Panel</p>
          </div>

          {/* Login Card */}
          <div className="bg-surface-2 border border-border rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={20} className="text-gold-400" />
              <h2 className="font-display font-semibold text-foreground text-lg">Sign In</h2>
            </div>

            {/* Info notice */}
            <div className="flex items-start gap-2 bg-gold-400/10 border border-gold-400/30 rounded-lg px-3 py-2.5 mb-5">
              <Info size={15} className="text-gold-400 mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                No username required — enter the <span className="text-foreground font-medium">admin password</span> only.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="admin-password" className="text-foreground text-sm">Admin Password</Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    autoComplete="current-password"
                    className="bg-surface-1 border-border text-foreground placeholder:text-muted-foreground focus:border-gold-400 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 text-destructive text-sm">
                  {authError}
                </div>
              )}

              <Button
                type="submit"
                disabled={verifyAdmin.isPending}
                className="w-full bg-gold-400 hover:bg-gold-500 text-surface-1 font-semibold mt-2"
              >
                {verifyAdmin.isPending && <Loader2 size={16} className="mr-2 animate-spin" />}
                Sign In
              </Button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Admin Header Bar */}
      <div className="bg-surface-2 border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gold-400 rounded-md flex items-center justify-center">
              <ShieldCheck size={16} className="text-surface-1" />
            </div>
            <div>
              <h1 className="font-display font-bold text-foreground text-base leading-tight">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground text-xs">Gadgets<span className="text-gold-400">Gear</span> Store Management</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-border text-muted-foreground hover:text-foreground hover:bg-surface-1 gap-2"
          >
            <LogOut size={14} />
            Logout
          </Button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminProductTable />
      </div>
    </main>
  );
}
