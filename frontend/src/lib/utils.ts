import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: bigint | number): string {
  const num = typeof price === 'bigint' ? Number(price) : price;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num / 100);
}

export function getProductImageUrl(imageUrl: string, productName: string): string {
  // Use a reliable placeholder based on product name for demo
  const encodedName = encodeURIComponent(productName);
  const colors = ['1a1a2e', '16213e', '0f3460', '1b1b2f', '2d132c'];
  const colorIndex = productName.length % colors.length;
  return `https://placehold.co/600x400/${colors[colorIndex]}/f59e0b?text=${encodedName}&font=montserrat`;
}
