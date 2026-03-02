import { createRouter, RouterProvider, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ProductListing } from './pages/ProductListing';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { CheckoutConfirmation } from './pages/CheckoutConfirmation';
import { SearchResults } from './pages/SearchResults';
import { Admin } from './pages/Admin';

// Layout component
function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

// Routes
const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const electronicsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/electronics',
  component: () => <ProductListing category="electronics" />,
});

const watchesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/watches',
  component: () => <ProductListing category="watches" />,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$id',
  component: ProductDetail,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: Cart,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: Checkout,
});

const checkoutConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout/confirmation',
  component: CheckoutConfirmation,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  validateSearch: (search: Record<string, unknown>) => ({
    q: (search.q as string) ?? '',
  }),
  component: SearchResults,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: Admin,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  electronicsRoute,
  watchesRoute,
  productDetailRoute,
  cartRoute,
  checkoutRoute,
  checkoutConfirmationRoute,
  searchRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}
