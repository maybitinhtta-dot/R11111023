import React, { useState } from 'react';
import { CartItem, StoreConfig, Order } from '../../types/store';
import { X, CheckCircle, ShieldCheck, Lock, CreditCard, Smartphone, Truck, ArrowLeft, Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discountPercent: number;
  config: StoreConfig;
  onOrderCompleted: (order: Order) => void;
  onViewAdminOrder: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discountPercent,
  config,
  onOrderCompleted,
  onViewAdminOrder,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState<string>('林語晴 (Yuching Lin)');
  const [customerEmail, setCustomerEmail] = useState<string>('yuching.lin@gmail.com');
  const [customerPhone, setCustomerPhone] = useState<string>('0928-666-888');
  const [shippingAddress, setShippingAddress] = useState<string>('台北市信義區松德路 168 巷 22 號 5 樓');
  const [shippingMethod, setShippingMethod] = useState<'delivery' | 'convenience'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'apple_pay' | 'line_pay' | 'cod'>('credit_card');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const isFreeShipping = subtotal >= config.freeShippingThreshold;
  const shippingFee = subtotal > 0 ? (isFreeShipping ? 0 : 80) : 0;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrderNumber = `#10${Math.floor(50 + Math.random() * 50)}`;

    const paymentLabelMap: Record<string, string> = {
      credit_card: 'Shopify Payments (Visa · 4242)',
      apple_pay: 'Apple Pay (快速結帳)',
      line_pay: 'LINE Pay 行動支付',
      cod: '黑貓宅急便 貨到付款 (COD)',
    };

    const newOrder: Order = {
      id: `ord-${randomSuffix}`,
      orderNumber: newOrderNumber,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress:
        shippingMethod === 'delivery'
          ? shippingAddress
          : '7-ELEVEN 敦南門市 (取貨不付款)',
      items: [...items],
      subtotal,
      discount: discountAmount,
      shippingFee,
      total,
      paymentMethod: paymentLabelMap[paymentMethod] || 'Shopify Payments',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      fulfillmentStatus: 'unfulfilled',
      createdAt: '2026-11-09 21:45',
      channel: 'online',
    };

    setConfirmedOrder(newOrder);
    setIsSubmitting(false);
    onOrderCompleted(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
              S
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-900">
              {config.name.split('·')[0].trim()} · 安全結帳頁面
            </span>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              (Shopify Checkout)
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {confirmedOrder ? (
          /* Order Confirmed Success Screen */
          <div className="p-6 md:p-10 text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="text-xs font-mono text-emerald-800 uppercase tracking-widest font-semibold">
                Order Confirmed
              </span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                感謝您的購買！訂單已成立
              </h2>
              <p className="text-xs text-slate-600">
                訂單確認信件已同步寄送至{' '}
                <span className="font-mono font-semibold text-slate-900">
                  {confirmedOrder.customerEmail}
                </span>
                。我們將儘速為您安排出貨。
              </p>
            </div>

            {/* Receipt Card */}
            <div className="max-w-md mx-auto bg-slate-50 rounded-xl p-5 border border-slate-200 text-left text-xs space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Shopify 訂單編號</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {confirmedOrder.orderNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">收件顧客姓名</span>
                <span className="font-semibold text-slate-800">
                  {confirmedOrder.customerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">配送地址</span>
                <span className="text-slate-700 truncate max-w-[220px]">
                  {confirmedOrder.shippingAddress}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">付款方式</span>
                <span className="text-slate-800 font-medium">
                  {confirmedOrder.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold">
                <span className="text-slate-900">實付結帳總額</span>
                <span className="font-mono text-emerald-800">
                  {config.currencySymbol}{' '}
                  {confirmedOrder.total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                返回商店繼續逛逛
              </button>
              <button
                onClick={() => {
                  onClose();
                  onViewAdminOrder(confirmedOrder.id);
                }}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm"
              >
                在 Shopify 後台即刻查看此訂單 →
              </button>
            </div>
          </div>
        ) : (
          /* Normal Checkout Step */
          <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
            {/* Form Left Column */}
            <form
              onSubmit={handlePlaceOrder}
              className="md:w-7/12 p-6 md:p-8 space-y-6 overflow-y-auto border-b md:border-b-0 md:border-r border-slate-200"
            >
              {/* Express checkout banner */}
              <div className="space-y-2">
                <div className="text-xs text-slate-500 font-medium text-center">
                  快速一鍵安全結帳 (Express Checkout)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className="py-2.5 px-3 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Pay 快速支付</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('line_pay')}
                    className="py-2.5 px-3 bg-[#06C755] hover:bg-[#05b34c] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>LINE Pay 快捷結帳</span>
                  </button>
                </div>
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-4 text-xs text-slate-400">
                    或者填寫配送資訊
                  </span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">
                  顧客聯絡與收件資訊
                </h3>
                <div className="space-y-2.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      電子郵件信箱 (接收訂單通知)
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        收件人姓名
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        手機號碼
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      詳細收件地址
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900">運送方式</h3>
                <div className="space-y-2">
                  <label
                    onClick={() => setShippingMethod('delivery')}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer text-xs ${
                      shippingMethod === 'delivery'
                        ? 'border-emerald-600 bg-emerald-50/40'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Truck className="w-4 h-4 text-emerald-700" />
                      <div>
                        <span className="font-semibold text-slate-900 block">
                          黑貓宅急便 · 標準宅配到府
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          預計 2–3 個工作日內送達
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-semibold text-slate-800">
                      {isFreeShipping ? '免運費' : 'NT$ 80'}
                    </span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('convenience')}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer text-xs ${
                      shippingMethod === 'convenience'
                        ? 'border-emerald-600 bg-emerald-50/40'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Truck className="w-4 h-4 text-slate-500" />
                      <div>
                        <span className="font-semibold text-slate-900 block">
                          7-ELEVEN / 全家超商取貨
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          抵達門市將發送簡訊通知
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-semibold text-slate-800">
                      {isFreeShipping ? '免運費' : 'NT$ 65'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900">付款方式</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    {
                      id: 'credit_card',
                      name: '線上信用卡',
                      desc: 'Shopify Payments',
                      icon: CreditCard,
                    },
                    {
                      id: 'apple_pay',
                      name: 'Apple Pay',
                      desc: '安全指紋/面容',
                      icon: Smartphone,
                    },
                    {
                      id: 'line_pay',
                      name: 'LINE Pay',
                      desc: '點數可折抵',
                      icon: Smartphone,
                    },
                    {
                      id: 'cod',
                      name: '貨到付款',
                      desc: '收件時現金交付',
                      icon: Truck,
                    },
                  ].map((pm) => {
                    const isSelected = paymentMethod === pm.id;
                    const IconComp = pm.icon;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-slate-900 text-white font-medium shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <IconComp className="w-4 h-4" />
                          <span className="font-semibold">{pm.name}</span>
                        </div>
                        <span
                          className={`text-[11px] ${
                            isSelected ? 'text-slate-300' : 'text-slate-400'
                          }`}
                        >
                          {pm.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm font-sans"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>正在透過 Shopify Payments 授權處理...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>
                      立即下單 ({config.currencySymbol}{' '}
                      {total.toLocaleString()})
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Order Summary Right Column */}
            <div className="md:w-5/12 bg-slate-50/80 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  訂單品項清單 ({items.length})
                </h3>

                <div className="space-y-3 max-h-[300px] overflow-y-auto divide-y divide-slate-200/60">
                  {items.map((item, idx) => (
                    <div
                      key={`${item.product.id}-${idx}`}
                      className="pt-3 first:pt-0 flex items-center gap-3"
                    >
                      <div className="relative">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover bg-slate-200 shrink-0 border border-slate-200"
                        />
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-700 text-white font-mono text-[10px] flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-slate-900 truncate">
                          {item.product.name}
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          {item.selectedVariant}
                        </span>
                      </div>

                      <span className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                        {config.currencySymbol}{' '}
                        {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>商品小計</span>
                    <span className="font-mono tabular-nums text-slate-800">
                      {config.currencySymbol} {subtotal.toLocaleString()}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>優惠折抵 ({discountPercent}%)</span>
                      <span className="font-mono tabular-nums">
                        - {config.currencySymbol}{' '}
                        {discountAmount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-500">
                    <span>物流運費</span>
                    <span className="font-mono tabular-nums text-slate-800">
                      {shippingFee === 0
                        ? '免運費'
                        : `${config.currencySymbol} ${shippingFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-200">
                    <span>總付款金額</span>
                    <span className="font-mono text-emerald-800 tabular-nums">
                      {config.currencySymbol} {total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Shopify Level 1 PCI DSS 認證合規加密交易</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
