import React, { useState } from 'react';
import { CartItem, StoreConfig } from '../../types/store';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Truck, Check } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number, variant?: string) => void;
  onRemoveItem: (productId: string, variant?: string) => void;
  onProceedToCheckout: (appliedDiscountPercent: number) => void;
  config: StoreConfig;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  config,
}) => {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState<string>('SHOPIFY2026');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(15); // default 15%
  const [promoMessage, setPromoMessage] = useState<string>('已套用新店開幕 85 折優惠！');

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountAmount = Math.round((subtotal * appliedDiscount) / 100);
  const isFreeShipping = subtotal >= config.freeShippingThreshold;
  const shippingFee = subtotal > 0 ? (isFreeShipping ? 0 : 80) : 0;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'SHOPIFY2026') {
      setAppliedDiscount(15);
      setPromoMessage('已套用新店開幕 85 折優惠 (-15%)！');
    } else if (code === 'WELCOME10') {
      setAppliedDiscount(10);
      setPromoMessage('已套用會員迎新 9 折優惠 (-10%)！');
    } else {
      setPromoMessage('無效或已過期的折扣碼');
      setAppliedDiscount(0);
    }
  };

  const amountNeededForFreeShipping = Math.max(
    0,
    config.freeShippingThreshold - subtotal
  );
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / config.freeShippingThreshold) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">
              購物袋清單 ({items.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="關閉"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Tracker Bar */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200/80">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" />
              {isFreeShipping ? (
                <span className="text-emerald-700 font-bold">
                  太棒了！已達成全館免運門檻 🎉
                </span>
              ) : (
                <span>
                  還差 {config.currencySymbol}{' '}
                  <span className="font-mono text-emerald-700 font-bold">
                    {amountNeededForFreeShipping.toLocaleString()}
                  </span>{' '}
                  即可享有免運！
                </span>
              )}
            </span>
            <span className="font-mono text-slate-500">
              {freeShippingProgress}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isFreeShipping ? 'bg-emerald-600' : 'bg-emerald-500'
              }`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Line Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                購物袋目前是空的
              </h4>
              <p className="text-xs text-slate-500 max-w-xs">
                瀏覽我們的工藝生活商品，將心儀的作品加入購物袋。
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
              >
                前往選購商品
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.product.id}-${idx}`} className="py-3 flex gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-18 h-18 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() =>
                          onRemoveItem(item.product.id, item.selectedVariant)
                        }
                        className="text-slate-400 hover:text-rose-600 p-0.5 transition-colors"
                        title="移除商品"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.selectedVariant && (
                      <span className="text-[11px] text-slate-500 block">
                        款式：{item.selectedVariant}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-md bg-slate-50">
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.product.id,
                            -1,
                            item.selectedVariant
                          )
                        }
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-mono font-bold text-slate-800 min-w-6 text-center bg-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.product.id,
                            1,
                            item.selectedVariant
                          )
                        }
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-bold text-slate-900 font-mono">
                      {config.currencySymbol}{' '}
                      {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout Controls */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            {/* Promo code input */}
            <div className="space-y-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="優惠折扣碼 (例：SHOPIFY2026)"
                    className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-white uppercase font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
                >
                  套用
                </button>
              </div>
              {promoMessage && (
                <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                  <Check className="w-3 h-3" />
                  {promoMessage}
                </div>
              )}
            </div>

            {/* Calculations breakdown */}
            <div className="space-y-1.5 text-xs pt-2 border-t border-slate-200/60">
              <div className="flex justify-between text-slate-500">
                <span>商品小計 (Subtotal)</span>
                <span className="font-mono tabular-nums text-slate-800">
                  {config.currencySymbol} {subtotal.toLocaleString()}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>促銷優惠折抵 ({appliedDiscount}%)</span>
                  <span className="font-mono tabular-nums">
                    - {config.currencySymbol} {discountAmount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-500">
                <span>預估運費</span>
                <span className="font-mono tabular-nums text-slate-800">
                  {shippingFee === 0
                    ? '免運費 (Free)'
                    : `${config.currencySymbol} ${shippingFee}`}
                </span>
              </div>

              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>結帳總額 (Total)</span>
                <span className="font-mono text-base tabular-nums text-emerald-800">
                  {config.currencySymbol} {total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => onProceedToCheckout(appliedDiscount)}
              className="w-full py-3 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm font-sans"
            >
              <span>前往 Shopify 結帳</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center">
              <span className="text-[11px] text-slate-400">
                全站支援 256 位元 SSL 安全加密與防詐騙保護
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
