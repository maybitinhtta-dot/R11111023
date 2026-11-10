/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  StoreConfig,
  Product,
  CartItem,
  Order,
  SalesChannel,
  ActiveTab,
  ViewportMode,
} from './types/store';
import {
  initialStoreConfig,
  initialProducts,
  initialOrders,
  initialSalesChannels,
} from './data/initialData';
import { GlobalHeader } from './components/Navigation/GlobalHeader';
import { StoreCreationWizard } from './components/Wizard/StoreCreationWizard';
import { StorefrontView } from './components/Storefront/StorefrontView';
import { ProductDetailModal } from './components/Storefront/ProductDetailModal';
import { CartDrawer } from './components/Storefront/CartDrawer';
import { CheckoutModal } from './components/Storefront/CheckoutModal';
import { QRCodeModal } from './components/Navigation/QRCodeModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('storefront');
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [config, setConfig] = useState<StoreConfig>(initialStoreConfig);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [salesChannels, setSalesChannels] = useState<SalesChannel[]>(initialSalesChannels);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: initialProducts[0],
      quantity: 1,
      selectedVariant: initialProducts[0].variants?.[0] || '標準版',
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isQROpen, setIsQROpen] = useState<boolean>(true);
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState<number>(15);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);

  // Cart actions
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product: Product, quantity = 1, variant?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.product.id === product.id && i.selectedVariant === variant
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedVariant: variant || product.variants?.[0] || '標準版',
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = (product: Product, quantity = 1, variant?: string) => {
    handleAddToCart(product, quantity, variant);
    setSelectedProductForDetail(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number, variant?: string) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId && item.selectedVariant === variant) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (productId: string, variant?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.product.id === productId && item.selectedVariant === variant)
      )
    );
  };

  const handleProceedToCheckout = (discountPercent: number) => {
    setAppliedDiscountPercent(discountPercent);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Order creation from checkout
  const handleOrderCompleted = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    // update online sales volume
    setSalesChannels((prev) =>
      prev.map((ch) =>
        ch.type === 'online'
          ? {
              ...ch,
              ordersCount: ch.ordersCount + 1,
              salesVolume: ch.salesVolume + newOrder.total,
            }
          : ch
      )
    );
    // clear cart
    setCart([]);
  };

  // Fulfill order
  const handleFulfillOrder = (orderId: string) => {
    const randomTracking = `TC-${Math.floor(1000000000 + Math.random() * 9000000000)}TW`;
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              fulfillmentStatus: 'fulfilled',
              trackingNumber: randomTracking,
            }
          : ord
      )
    );
  };

  // Product CRUD
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleToggleProductStatus = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, status: p.status === 'active' ? 'draft' : 'active' }
          : p
      )
    );
  };

  // Wizard application save
  const handleSaveWizardConfig = (
    newConfig: StoreConfig,
    seededProducts?: Product[]
  ) => {
    setConfig(newConfig);
    if (seededProducts && seededProducts.length > 0) {
      setProducts(seededProducts);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Global Top Bar (Complies with Top Bar Contract) */}
      <GlobalHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewportMode={viewportMode}
        setViewportMode={setViewportMode}
        storeName={config.name}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
        onOpenQR={() => setIsQROpen(true)}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'wizard' && (
          <StoreCreationWizard
            currentConfig={config}
            onSaveConfig={handleSaveWizardConfig}
            onComplete={() => setActiveTab('storefront')}
          />
        )}

        {activeTab === 'storefront' && (
          <StorefrontView
            config={config}
            products={products}
            onOpenProduct={(prod) => setSelectedProductForDetail(prod)}
            onQuickAddToCart={(prod) => handleAddToCart(prod, 1)}
            cartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(true)}
            viewportMode={viewportMode}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            config={config}
            onUpdateConfig={setConfig}
            products={products}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onToggleProductStatus={handleToggleProductStatus}
            orders={orders}
            onFulfillOrder={handleFulfillOrder}
            salesChannels={salesChannels}
            onViewStorefront={() => setActiveTab('storefront')}
            onReopenWizard={() => setActiveTab('wizard')}
          />
        )}
      </div>

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        config={config}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
        config={config}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        discountPercent={appliedDiscountPercent}
        config={config}
        onOrderCompleted={handleOrderCompleted}
        onViewAdminOrder={() => {
          setActiveTab('admin');
        }}
      />

      {/* QR Code Presentation Modal */}
      <QRCodeModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        storeUrl={`https://${config.handle}.myshopify.com`}
        onOpenMobilePreview={() => {
          setActiveTab('storefront');
          setViewportMode('mobile');
        }}
      />
    </div>
  );
}
