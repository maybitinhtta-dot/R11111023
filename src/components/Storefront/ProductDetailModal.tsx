import React, { useState } from 'react';
import { Product, StoreConfig } from '../../types/store';
import { X, Check, Star, ShieldCheck, RefreshCw, ShoppingBag, ArrowRight } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, variant?: string) => void;
  onBuyNow: (product: Product, quantity: number, variant?: string) => void;
  config: StoreConfig;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  config,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<string>(
    product.variants?.[0] || '標準版'
  );
  const [imgError, setImgError] = useState<boolean>(false);

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedVariant);
  };

  const handleInstantBuy = () => {
    onBuyNow(product, quantity, selectedVariant);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden relative max-h-[92vh] flex flex-col md:flex-row">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="關閉"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-slate-100 text-slate-700 transition-colors shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Column */}
        <div className="md:w-1/2 bg-slate-100 relative min-h-[300px] md:min-h-full flex items-center justify-center overflow-hidden">
          {!imgError ? (
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover max-h-[500px]"
            />
          ) : (
            <div className="w-full h-full min-h-[360px] bg-gradient-to-br from-slate-200 to-slate-300 flex flex-col items-center justify-center p-8 text-center">
              <ShoppingBag className="w-12 h-12 text-slate-400 mb-2" />
              <span className="text-sm font-semibold text-slate-600">
                {product.name}
              </span>
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90 bg-slate-950/60 backdrop-blur-xs px-3 py-1.5 rounded-lg">
            <span>SKU: {product.sku}</span>
            <span>現貨庫存: {product.stock} 件</span>
          </div>
        </div>

        {/* Product Details & Purchase Module */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            {/* Category & Status */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-emerald-800">
                {product.category}
              </span>
              <span aria-hidden="true">·</span>
              <span>頂級工藝真皮包款</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-medium">現貨在庫</span>
            </div>

            {/* Title */}
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h2>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="font-bold font-mono text-slate-800">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-slate-400">
                  ({product.reviewCount} 則顧客真實評價)
                </span>
              </div>
            )}

            {/* Price Box */}
            <div className="flex items-baseline gap-3 py-2 border-y border-slate-100">
              <span className="text-2xl md:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                {config.currencySymbol} {product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-slate-400 line-through font-mono">
                  {config.currencySymbol}{' '}
                  {product.compareAtPrice.toLocaleString()}
                </span>
              )}
              {product.compareAtPrice && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  現省 {config.currencySymbol}{' '}
                  {(product.compareAtPrice - product.price).toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Variant selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                  <span>規格與材質款式</span>
                  <span className="text-slate-500 font-normal">
                    已選：{selectedVariant}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                        selectedVariant === v
                          ? 'border-slate-900 bg-slate-900 text-white font-medium shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features */}
            {product.features && (
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-semibold text-slate-700 block">
                  工藝規格重點
                </span>
                <ul className="space-y-1 text-xs text-slate-600">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Quantity & Buy Bar */}
          <div className="space-y-3 pt-6 border-t border-slate-100 mt-6">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-slate-700">購買數量</span>
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-slate-600 hover:bg-slate-200 text-sm font-bold transition-colors"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold font-mono text-slate-800 min-w-8 text-center bg-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  className="px-3 py-1 text-slate-600 hover:bg-slate-200 text-sm font-bold transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-[11px] text-slate-400">
                單筆訂單限購 {product.stock} 件
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAdd}
                className="w-full py-2.5 px-4 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                加入購物車
              </button>
              <button
                type="button"
                onClick={handleInstantBuy}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                立即購買
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Shopify 企業級安全支付</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>鑑賞期完整退換承諾</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
