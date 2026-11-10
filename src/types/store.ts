export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stock: number;
  image: string;
  description: string;
  sku: string;
  status: 'active' | 'draft';
  variants?: string[];
  features?: string[];
  rating?: number;
  reviewCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  fulfillmentStatus: 'unfulfilled' | 'fulfilled' | 'shipped';
  trackingNumber?: string;
  createdAt: string;
  channel: 'online' | 'pos' | 'instagram' | 'google';
}

export interface SalesChannel {
  id: string;
  name: string;
  type: 'online' | 'pos' | 'social' | 'marketplace';
  status: 'connected' | 'action_needed' | 'syncing';
  ordersCount: number;
  salesVolume: number;
  description: string;
}

export interface StoreConfig {
  name: string;
  handle: string;
  customDomain?: string;
  industry: string;
  businessType: string;
  tagline: string;
  theme: 'dawn' | 'horizon' | 'craft' | 'pulse';
  accentColor: string;
  currency: 'TWD' | 'USD' | 'EUR' | 'JPY';
  currencySymbol: string;
  freeShippingThreshold: number;
  announcementText: string;
  announcementEnabled: boolean;
  contactEmail: string;
  establishedDate: string;
}

export type ActiveTab = 'wizard' | 'storefront' | 'admin';
export type AdminSection = 'overview' | 'orders' | 'products' | 'channels' | 'theme' | 'analytics' | 'settings' | 'ai_tools';
export type ViewportMode = 'desktop' | 'tablet' | 'mobile';
