import React, { useState } from 'react';
import {
  StoreConfig,
  Product,
  Order,
  SalesChannel,
  AdminSection,
} from '../../types/store';
import { AddProductModal } from './AddProductModal';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Share2,
  Palette,
  BarChart3,
  Settings,
  ExternalLink,
  Plus,
  CheckCircle2,
  Clock,
  Truck,
  ArrowUpRight,
  Search,
  Filter,
  Globe2,
  Store,
  CreditCard,
  ShieldCheck,
  RefreshCw,
  Trash2,
  Sparkles,
  ChevronRight,
  Eye,
} from 'lucide-react';

interface AdminDashboardProps {
  config: StoreConfig;
  onUpdateConfig: (newConfig: StoreConfig) => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleProductStatus: (productId: string) => void;
  orders: Order[];
  onFulfillOrder: (orderId: string) => void;
  salesChannels: SalesChannel[];
  onViewStorefront: () => void;
  onReopenWizard: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  config,
  onUpdateConfig,
  products,
  onAddProduct,
  onDeleteProduct,
  onToggleProductStatus,
  orders,
  onFulfillOrder,
  salesChannels,
  onViewStorefront,
  onReopenWizard,
}) => {
  const [currentSection, setCurrentSection] = useState<AdminSection>('overview');
  const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false);
  const [orderFilter, setOrderFilter] = useState<'all' | 'unfulfilled' | 'fulfilled'>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [aiTone, setAiTone] = useState<'luxury' | 'commute' | 'social'>('luxury');
  const [aiProductFocus, setAiProductFocus] = useState<string>('R11111023 經典義大利植鞣皮革托特包');

  // Financial calculations
  const totalSalesVolume = orders.reduce((sum, ord) => sum + ord.total, 0);
  const totalOrdersCount = orders.length;
  const unfulfilledOrdersCount = orders.filter((o) => o.fulfillmentStatus === 'unfulfilled').length;
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalSalesVolume / totalOrdersCount) : 0;

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    const matchStatus =
      orderFilter === 'all' || ord.fulfillmentStatus === orderFilter;
    const matchSearch =
      orderSearch === '' ||
      ord.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 font-sans flex flex-col md:flex-row">
      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 border-r border-slate-800 flex flex-col justify-between">
        <div>
          {/* Merchant Identity header */}
          <div className="p-5 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/30 font-mono text-base">
                S
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white truncate block">
                  {config.name.split('·')[0].trim()}
                </span>
                <span className="text-[11px] text-slate-400 font-mono truncate block">
                  {config.handle}.myshopify.com
                </span>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1">
            {[
              { id: 'overview', name: '營運總覽', icon: LayoutDashboard },
              {
                id: 'orders',
                name: '訂單管理',
                icon: ShoppingBag,
                badge: unfulfilledOrdersCount > 0 ? unfulfilledOrdersCount : undefined,
              },
              { id: 'products', name: '商品型錄', icon: Package },
              { id: 'channels', name: '全通路銷售', icon: Share2 },
              { id: 'ai_tools', name: 'AI 開店工具箱', icon: Sparkles, badge: 'AI' },
              { id: 'theme', name: '主題外觀自訂', icon: Palette },
              { id: 'analytics', name: '數據分析', icon: BarChart3 },
              { id: 'settings', name: '網域與設定', icon: Settings },
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentSection(item.id as AdminSection)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={onViewStorefront}
            className="w-full py-2 px-3 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span>檢視前台官網</span>
          </button>
          <button
            onClick={onReopenWizard}
            className="w-full py-1.5 px-3 text-[11px] text-slate-500 hover:text-slate-300 text-center block transition-colors"
          >
            重新執行商店建立嚮導
          </button>
        </div>
      </aside>

      {/* Main Admin Viewport */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header Breadcrumb Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">Shopify Admin</span>
            <span>/</span>
            <span className="font-mono">{config.handle}</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold capitalize">
              {currentSection}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增商品</span>
            </button>
          </div>
        </header>

        {/* Section Contents */}
        <div className="p-6 md:p-8 space-y-6 flex-1 overflow-y-auto">
          {/* OVERVIEW SECTION */}
          {currentSection === 'overview' && (
            <div className="space-y-6">
              {/* Store Setup Success Celebration Alert */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      恭喜！您的 Shopify 線上商店「{config.name.split('·')[0].trim()}」已成功部署啟用
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      SSL 憑證已就緒，全球 CDN 邊緣加速運作中。全通路庫存與金流系統已同步啟動。
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onViewStorefront}
                    className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors whitespace-nowrap shadow-xs"
                  >
                    前往前台選購體驗
                  </button>
                </div>
              </div>

              {/* KPI Stat Cards Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                  <div className="text-xs font-semibold text-slate-500">
                    累計營業總額 (Gross Sales)
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                    {config.currencySymbol} {totalSalesVolume.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>較昨日成長 +14.2%</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                  <div className="text-xs font-semibold text-slate-500">
                    總訂單數 (Total Orders)
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                    {totalOrdersCount} 筆
                  </div>
                  <div className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>待出貨: {unfulfilledOrdersCount} 筆</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                  <div className="text-xs font-semibold text-slate-500">
                    平均客單價 (AOV)
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                    {config.currencySymbol} {averageOrderValue.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    高單價工藝選品表現優異
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                  <div className="text-xs font-semibold text-slate-500">
                    商店轉換率 (Conversion Rate)
                  </div>
                  <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
                    3.84%
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium">
                    優於業界平均 (2.1%)
                  </div>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-900">
                      最新交易訂單
                    </h3>
                  </div>
                  <button
                    onClick={() => setCurrentSection('orders')}
                    className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
                  >
                    查看全部訂單 <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {orders.slice(0, 4).map((order) => (
                    <div
                      key={order.id}
                      className="p-4 hover:bg-slate-50 flex items-center justify-between gap-4 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold flex items-center justify-center shrink-0">
                          {order.orderNumber}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">
                            {order.customerName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {order.createdAt} · {order.paymentMethod}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-mono font-bold text-slate-900">
                            {config.currencySymbol} {order.total.toLocaleString()}
                          </div>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              order.fulfillmentStatus === 'fulfilled'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.fulfillmentStatus === 'fulfilled'
                              ? '已出貨完成'
                              : '待履行出貨'}
                          </span>
                        </div>

                        {order.fulfillmentStatus === 'unfulfilled' && (
                          <button
                            onClick={() => onFulfillOrder(order.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
                          >
                            標記出貨
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Multi-channel Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      活躍銷售渠道
                    </h3>
                    <span className="text-[11px] font-mono text-emerald-700">
                      4 渠道全開通
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {salesChannels.map((ch) => (
                      <div
                        key={ch.id}
                        className="p-3 bg-slate-50 rounded-xl flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-slate-800 block">
                            {ch.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {ch.ordersCount} 筆訂單已完成
                          </span>
                        </div>
                        <span className="font-mono font-bold text-slate-900">
                          {config.currencySymbol}{' '}
                          {ch.salesVolume.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Shopify 基礎設施狀態
                    </h3>
                    <span className="text-[11px] font-mono text-emerald-700">
                      99.99% 正常運行
                    </span>
                  </div>
                  <div className="space-y-2.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between p-2.5 border border-slate-100 rounded-lg">
                      <span className="flex items-center gap-2">
                        <Globe2 className="w-4 h-4 text-emerald-600" />
                        <span>Cloudflare CDN 邊緣加速</span>
                      </span>
                      <span className="font-mono text-emerald-700 font-bold">
                        活躍快取中
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 border border-slate-100 rounded-lg">
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>SSL Let's Encrypt 萬用字元憑證</span>
                      </span>
                      <span className="font-mono text-emerald-700 font-bold">
                        自動續約有效
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 border border-slate-100 rounded-lg">
                      <span className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <span>Shopify Payments 整合金流</span>
                      </span>
                      <span className="font-mono text-emerald-700 font-bold">
                        已就緒
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS SECTION */}
          {currentSection === 'orders' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">訂單管理</h2>
                  <p className="text-xs text-slate-500">
                    檢視並履行來自線上商店、門市 POS 及社群的所有顧客訂單。
                  </p>
                </div>

                {/* Filter and search */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="搜尋訂單編號或姓名..."
                      className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 w-44 sm:w-56"
                    />
                  </div>

                  <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg text-xs">
                    {(['all', 'unfulfilled', 'fulfilled'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setOrderFilter(st)}
                        className={`px-2.5 py-1 rounded text-xs transition-colors ${
                          orderFilter === st
                            ? 'bg-slate-900 text-white font-medium'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {st === 'all'
                          ? '全部'
                          : st === 'unfulfilled'
                          ? '待出貨'
                          : '已完成'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="px-5 py-3">訂單編號</th>
                        <th className="px-5 py-3">成立時間</th>
                        <th className="px-5 py-3">顧客資訊</th>
                        <th className="px-5 py-3">購買品項</th>
                        <th className="px-5 py-3 text-right">訂單金額</th>
                        <th className="px-5 py-3 text-center">付款狀態</th>
                        <th className="px-5 py-3 text-center">出貨狀態</th>
                        <th className="px-5 py-3 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-12 text-slate-400">
                            沒有相符的訂單紀錄
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                              {order.orderNumber}
                            </td>
                            <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                              {order.createdAt}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="font-semibold text-slate-900 block">
                                {order.customerName}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {order.customerEmail}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 max-w-[200px] truncate text-slate-700">
                              {order.items.map((i) => `${i.product.name} x${i.quantity}`).join(', ')}
                            </td>
                            <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-900 tabular-nums">
                              {config.currencySymbol} {order.total.toLocaleString()}
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                                  order.paymentStatus === 'paid'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {order.paymentStatus === 'paid' ? '已付款' : '待付款'}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                                  order.fulfillmentStatus === 'fulfilled'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {order.fulfillmentStatus === 'fulfilled'
                                  ? '已出貨'
                                  : '未出貨'}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              {order.fulfillmentStatus === 'unfulfilled' ? (
                                <button
                                  onClick={() => onFulfillOrder(order.id)}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
                                >
                                  出貨
                                </button>
                              ) : (
                                <button
                                  onClick={() => setSelectedOrderDetails(order)}
                                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                                >
                                  查看憑證
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS SECTION */}
          {currentSection === 'products' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">商品型錄目錄</h2>
                  <p className="text-xs text-slate-500">
                    管理全店商品、定價策略、庫存監控與上下架狀態。
                  </p>
                </div>

                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  新增商品
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="px-5 py-3">商品代表圖</th>
                        <th className="px-5 py-3">商品名稱與 SKU</th>
                        <th className="px-5 py-3">分類</th>
                        <th className="px-5 py-3 text-right">售價</th>
                        <th className="px-5 py-3 text-right">成本價</th>
                        <th className="px-5 py-3 text-right">毛利率</th>
                        <th className="px-5 py-3 text-center">庫存數量</th>
                        <th className="px-5 py-3 text-center">狀態</th>
                        <th className="px-5 py-3 text-right">管理操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((prod) => {
                        const marginPercent =
                          prod.price > 0 && prod.costPrice
                            ? Math.round(
                                ((prod.price - prod.costPrice) / prod.price) * 100
                              )
                            : 60;
                        return (
                          <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-5 py-3.5">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200"
                              />
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="font-bold text-slate-900 block">
                                {prod.name}
                              </span>
                              <span className="text-[11px] font-mono text-slate-400">
                                {prod.sku}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-slate-600">
                              {prod.category}
                            </td>
                            <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-900 tabular-nums">
                              {config.currencySymbol} {prod.price.toLocaleString()}
                            </td>
                            <td className="px-5 py-3.5 text-right font-mono text-slate-500 tabular-nums">
                              {config.currencySymbol}{' '}
                              {(prod.costPrice || 0).toLocaleString()}
                            </td>
                            <td className="px-5 py-3.5 text-right font-mono font-semibold text-emerald-700 tabular-nums">
                              {marginPercent}%
                            </td>
                            <td className="px-5 py-3.5 text-center font-mono font-semibold text-slate-800">
                              {prod.stock} 件
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <button
                                onClick={() => onToggleProductStatus(prod.id)}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                                  prod.status === 'active'
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                }`}
                              >
                                {prod.status === 'active' ? '上架中' : '草稿'}
                              </button>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <button
                                onClick={() => onDeleteProduct(prod.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="刪除商品"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CHANNELS SECTION */}
          {currentSection === 'channels' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  全通路銷售與整合
                </h2>
                <p className="text-xs text-slate-500">
                  Shopify 一站式打通官網、實體門市與社群平台，即時共享單一商品庫存。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {salesChannels.map((channel) => (
                  <div
                    key={channel.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                          {channel.type === 'online' && <Globe2 className="w-5 h-5 text-emerald-400" />}
                          {channel.type === 'pos' && <Store className="w-5 h-5 text-amber-400" />}
                          {channel.type === 'social' && <Share2 className="w-5 h-5 text-pink-400" />}
                          {channel.type === 'marketplace' && <ShoppingBag className="w-5 h-5 text-blue-400" />}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900">
                            {channel.name}
                          </h3>
                          <span className="text-[11px] font-mono text-emerald-700">
                            ● 連線正常 (即時同步)
                          </span>
                        </div>
                      </div>
                      <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-mono font-semibold">
                        {channel.ordersCount} 筆
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {channel.description}
                    </p>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">累計產生營業額</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {config.currencySymbol}{' '}
                        {channel.salesVolume.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* THEME CUSTOMIZER SECTION */}
          {currentSection === 'theme' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  線上商店主題自訂 (Online Store Customizer)
                </h2>
                <p className="text-xs text-slate-500">
                  調整前台公告文字、品牌標語與品牌主色，修改將即時反映在前台商店中。
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      品牌名稱
                    </label>
                    <input
                      type="text"
                      value={config.name}
                      onChange={(e) =>
                        onUpdateConfig({ ...config, name: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      品牌代表主色 (Accent Color)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={config.accentColor || '#1A4D2E'}
                        onChange={(e) =>
                          onUpdateConfig({
                            ...config,
                            accentColor: e.target.value,
                          })
                        }
                        className="w-10 h-9 p-0.5 border border-slate-200 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.accentColor || '#1A4D2E'}
                        onChange={(e) =>
                          onUpdateConfig({
                            ...config,
                            accentColor: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    首頁 Hero 大標題 / 品牌 Slogan
                  </label>
                  <textarea
                    rows={2}
                    value={config.tagline}
                    onChange={(e) =>
                      onUpdateConfig({ ...config, tagline: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="ann-switch"
                      checked={config.announcementEnabled}
                      onChange={(e) =>
                        onUpdateConfig({
                          ...config,
                          announcementEnabled: e.target.checked,
                        })
                      }
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <label
                      htmlFor="ann-switch"
                      className="text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      開啟全站頂部促銷/公告列
                    </label>
                  </div>
                  <input
                    type="text"
                    value={config.announcementText}
                    onChange={(e) =>
                      onUpdateConfig({
                        ...config,
                        announcementText: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-400">
                    變更會自動同步儲存至 Shopify Liquid 主題設定。
                  </span>
                  <button
                    onClick={onViewStorefront}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    預覽前台效果
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS SECTION */}
          {currentSection === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  商務數據與營收分析
                </h2>
                <p className="text-xs text-slate-500">
                  全通路即時銷售表現、顧客回購率與主力商品貢獻排行。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    各通路營收佔比
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">線上官網 (Online Store)</span>
                      <span className="font-mono font-bold text-slate-900">50.2%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '50.2%' }} />
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-slate-600">台北概念店 (Shopify POS)</span>
                      <span className="font-mono font-bold text-slate-900">23.7%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '23.7%' }} />
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-slate-600">Instagram / Facebook 社群</span>
                      <span className="font-mono font-bold text-slate-900">15.7%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-pink-600 h-1.5 rounded-full" style={{ width: '15.7%' }} />
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-slate-600">Google Shopping 購物搜尋</span>
                      <span className="font-mono font-bold text-slate-900">10.4%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: '10.4%' }} />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 md:col-span-2">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    主力熱銷商品銷售排行榜
                  </h3>
                  <div className="divide-y divide-slate-100 text-xs">
                    {products.slice(0, 4).map((p, idx) => (
                      <div key={p.id} className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-5 text-slate-400 font-mono font-bold">
                            0{idx + 1}
                          </span>
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-9 h-9 rounded object-cover border border-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block truncate max-w-[220px]">
                              {p.name}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {p.category}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-mono font-bold text-slate-900 block">
                            {config.currencySymbol}{' '}
                            {(p.price * (32 - idx * 6)).toLocaleString()}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            銷量: {32 - idx * 6} 件
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS SECTION */}
          {currentSection === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  網域、金流與系統設定
                </h2>
                <p className="text-xs text-slate-500">
                  查看已配置之 Shopify 獨立域名與安全 SSL 憑證資訊。
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    網域名稱 (Domains)
                  </h3>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {config.handle}.myshopify.com
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                          Primary
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 mt-0.5 block">
                        Shopify 託管 DNS · SSL 憑證有效 · 狀態正常
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700">
                      ● 已連線
                    </span>
                  </div>

                  {config.customDomain && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {config.customDomain}
                          </span>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                            Custom CNAME
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 mt-0.5 block">
                          CNAME 指向 shops.myshopify.com · 自動 SSL 加密
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700">
                        ● 已解析
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    付款方式與閘道 (Payment Gateways)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">Shopify Payments</span>
                        <span className="text-[11px] text-slate-400">信用卡 / Apple Pay / Google Pay</span>
                      </div>
                      <span className="text-emerald-700 font-semibold font-mono text-[11px]">啟用中</span>
                    </div>

                    <div className="p-3.5 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">LINE Pay 支付</span>
                        <span className="text-[11px] text-slate-400">行動掃碼快捷付款</span>
                      </div>
                      <span className="text-emerald-700 font-semibold font-mono text-[11px]">啟用中</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      重新設定或申請新商店
                    </span>
                    <span className="text-[11px] text-slate-400">
                      若欲調整產業類別或切換其他旗艦主題，可重新啟動建站精靈。
                    </span>
                  </div>
                  <button
                    onClick={onReopenWizard}
                    className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    開啟建站精靈
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI E-COMMERCE TOOLS SECTION */}
          {currentSection === 'ai_tools' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI-Powered E-Commerce Operations
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    AI 智慧開店全流程操作指南與實用工具箱
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    系統化解構 AI 開店四大關鍵環節：商品圖設計、爆款文案撰寫、行銷海報生成與藝術二維條碼。
                  </p>
                </div>
              </div>

              {/* Step A: AI Product Images - Designkit */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-5">
                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center font-mono border border-purple-200 text-sm">
                      A
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        AI 設計產品相關圖片（推薦工具：美圖設計室 DesignKit）
                      </h3>
                      <span className="text-xs text-slate-500">
                        智能商品去背換景 · AI 電商場景生成 · 虛擬模特換裝試背 · 4K 高清修復
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono bg-purple-100 text-purple-800 px-2.5 py-1 rounded-lg font-semibold">
                    工具：DesignKit
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 space-y-3 text-xs text-slate-600 leading-relaxed">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1.5">
                      <span className="font-bold text-slate-900 block">
                        操作方法與實戰流程：
                      </span>
                      <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                        <li>
                          <strong className="text-slate-800">白底原圖上傳與智慧辨識：</strong>
                          使用手機拍攝包款主體，上傳至美圖設計室「AI 商品圖」模組，AI 自動偵測包袋邊緣、提帶空隙與金屬五金，精準去背並羽化邊緣。
                        </li>
                        <li>
                          <strong className="text-slate-800">風格化商用場景生成：</strong>
                          選用預設商用場景模版（如：微風清水模展台、暖陽托斯卡尼石階、北歐極簡原木托盤），AI 自動依據包款光源方位合成逼真落影與材質反光。
                        </li>
                        <li>
                          <strong className="text-slate-800">AI 虛擬模特穿搭展示：</strong>
                          利用 AI 假模換真人功能，無需預約專業外籍模特兒與攝影棚，一鍵生成多身型、都會街頭穿搭情境圖。
                        </li>
                        <li>
                          <strong className="text-slate-800">4K 超高解析畫質修復：</strong>
                          一鍵進行皮質紋理增強，使植鞣牛皮毛孔與手工縫線在 Shopify 產品放大鏡（Zoom-in）下清晰無比。
                        </li>
                      </ol>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                      <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-800 font-semibold">
                        節省 85% 攝影成本
                      </div>
                      <div className="p-2.5 bg-indigo-50 rounded-lg border border-indigo-100 text-indigo-800 font-semibold">
                        單圖產出縮短至 3 分鐘
                      </div>
                      <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-100 text-amber-800 font-semibold">
                        支援多尺寸規格輸出
                      </div>
                    </div>
                  </div>

                  {/* Visual preview */}
                  <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                    <div className="space-y-1.5 text-center">
                      <img
                        src="/src/assets/images/product_leather_bag_1794289413321.jpg"
                        alt="商品棚拍去背"
                        className="w-full aspect-[4/3] object-cover rounded-xl border border-slate-200"
                      />
                      <span className="text-[11px] text-slate-500 font-mono">
                        ① 實體單品去背精準摳圖
                      </span>
                    </div>

                    <div className="space-y-1.5 text-center">
                      <img
                        src="/src/assets/images/hero_handbag_editorial_1794290082407.jpg"
                        alt="AI 場景生成換景"
                        className="w-full aspect-[4/3] object-cover rounded-xl border border-slate-200"
                      />
                      <span className="text-[11px] text-emerald-700 font-mono font-semibold">
                        ② AI 合成高端展台情境
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step B: AI Copywriting */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-5">
                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center font-mono border border-blue-200 text-sm">
                      B
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        AI 生產產品宣傳文案（推薦工具：ChatGPT-4o / Shopify Magic / Claude 3.5）
                      </h3>
                      <span className="text-xs text-slate-500">
                        結構化 Prompt 工程 · PAS 痛點轉換法 · AIDA 行銷公式 · SEO 關鍵字優化
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono bg-blue-100 text-blue-800 px-2.5 py-1 rounded-lg font-semibold">
                    工具：ChatGPT / Shopify Magic
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-6 space-y-3 text-xs text-slate-600 leading-relaxed">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
                      <span className="font-bold text-slate-900 block">
                        操作方法與提示詞（Prompt）模板：
                      </span>
                      <p className="text-[11px] font-mono bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700">
                        {`「你是一位專精高端奢侈皮件的資深電商文案總監。請針對【${aiProductFocus}】採用 AIDA 架構撰寫：
1. 吸引（Attention）：以極簡從容的生活哲學開篇。
2. 興趣（Interest）：強調義大利托斯卡尼植鞣革與手工馬鞍縫法。
3. 慾望（Desire）：喚起歲月自然包漿光澤的專屬陪伴感。
4. 行動（Action）：引導顧客點擊下單，享滿額免運。」`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">切換文案風格：</span>
                      <div className="flex gap-1.5 p-1 bg-slate-100 rounded-lg">
                        <button
                          onClick={() => setAiTone('luxury')}
                          className={`px-2.5 py-1 rounded text-xs transition-colors ${
                            aiTone === 'luxury'
                              ? 'bg-white text-slate-950 font-bold shadow-xs'
                              : 'text-slate-600'
                          }`}
                        >
                          高端奢華風
                        </button>
                        <button
                          onClick={() => setAiTone('commute')}
                          className={`px-2.5 py-1 rounded text-xs transition-colors ${
                            aiTone === 'commute'
                              ? 'bg-white text-slate-950 font-bold shadow-xs'
                              : 'text-slate-600'
                          }`}
                        >
                          實用通勤風
                        </button>
                        <button
                          onClick={() => setAiTone('social')}
                          className={`px-2.5 py-1 rounded text-xs transition-colors ${
                            aiTone === 'social'
                              ? 'bg-white text-slate-950 font-bold shadow-xs'
                              : 'text-slate-600'
                          }`}
                        >
                          社群種草風 (IG)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* AI Generated Output Box */}
                  <div className="lg:col-span-6 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-500 pb-1.5 border-b border-slate-200">
                        <span className="font-bold text-slate-800">
                          AI 即時生成文案成果展示
                        </span>
                        <span className="font-mono text-emerald-700 text-[10px]">
                          Generated in 1.2s
                        </span>
                      </div>

                      {aiTone === 'luxury' && (
                        <div className="space-y-1.5 text-slate-700 text-xs leading-relaxed">
                          <p className="font-bold text-slate-900">
                            【安靜的力量，盛裝時光的優雅沉澱】
                          </p>
                          <p>
                            物件本不言語，卻在晨光與微風中訴說品味。R11111023
                            托特包嚴選義大利托斯卡尼植鞣皮革，不加掩飾的天然皮紋與手工雙面馬鞍縫法，伴隨歲月摩挲，綻放出專屬於您的深邃焦糖包漿。極簡，卻無比豐盈。
                          </p>
                          <span className="text-emerald-700 font-semibold block text-[11px]">
                            👉 立即典藏專屬手作工藝，享開幕慶全館免運到府。
                          </span>
                        </div>
                      )}

                      {aiTone === 'commute' && (
                        <div className="space-y-1.5 text-slate-700 text-xs leading-relaxed">
                          <p className="font-bold text-slate-900">
                            【從晨間會議到差旅飛行，從容收納一整天的底氣】
                          </p>
                          <p>
                            通勤不再是沉重的妥協。專為 15.6 吋筆記型電腦與 A4
                            重要合約打造的力學空間，加寬減壓肩帶長久揹負依然輕盈，防潑水耐磨底座穩如泰山。這是現代職場菁英最高效的無聲戰袍。
                          </p>
                          <span className="text-emerald-700 font-semibold block text-[11px]">
                            👉 結帳輸入「SHOPIFY2026」現抵 15% 優惠。
                          </span>
                        </div>
                      )}

                      {aiTone === 'social' && (
                        <div className="space-y-1.5 text-slate-700 text-xs leading-relaxed">
                          <p className="font-bold text-slate-900">
                            被問爆的法式極簡大包找到了！質感直接拉滿 ✨
                          </p>
                          <p>
                            真的一揹上就被身邊同事誇品味好！那種義大利真皮特有的自然皮革香氣真的太治癒～不管是白襯衫還是厚大衣隨便搭都自帶鬆弛感濾鏡
                            ☕️
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            #OOTD日常穿搭 #上班通勤包 #真皮包包 #R11111023
                            #Shopify購物
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step C: AI Posters & Marketing Banners */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-5">
                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 font-bold flex items-center justify-center font-mono border border-amber-200 text-sm">
                      C
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        AI 生產行銷海報（推薦工具：Canva Magic Studio / Midjourney）
                      </h3>
                      <span className="text-xs text-slate-500">
                        AI 底圖生成 · 神奇版面排版 (Magic Design) · 一鍵多尺寸自適應調整
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg font-semibold">
                    工具：Canva / Midjourney
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-6 space-y-3 text-xs text-slate-600 leading-relaxed">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1.5">
                      <span className="font-bold text-slate-900 block">
                        海報製作三階段操作方法：
                      </span>
                      <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                        <li>
                          <strong className="text-slate-800">情境底圖生成（Midjourney / Firefly）：</strong>
                          下達「minimalist architecture showcase podium, warm daylight, negative space for text」指令，產出具備大面積留白的專業商業背景。
                        </li>
                        <li>
                          <strong className="text-slate-800">商品與促銷文案自動套版（Canva Magic Design）：</strong>
                          將步驟 A 處理好的去背包款與步驟 B 的標語匯入，AI 自動匹配襯線字體、排版層次與品牌主色（Artisan Emerald）。
                        </li>
                        <li>
                          <strong className="text-slate-800">全通路尺寸智慧變更（Magic Switch）：</strong>
                          單一設計稿一鍵自適應生成：官網橫幅 (16:9)、IG 正方形貼文 (1:1)、限時動態宣傳海報 (9:16)。
                        </li>
                      </ol>
                    </div>
                  </div>

                  {/* Poster showcase */}
                  <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                    <img
                      src="/src/assets/images/hero_handbag_editorial_1794290082407.jpg"
                      alt="海報視覺底圖"
                      className="w-full aspect-[16/9] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-6 flex flex-col justify-end text-white space-y-1.5">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-300 font-semibold">
                        R11111023 · NEW ARRIVALS
                      </span>
                      <h4 className="text-lg font-bold font-serif">
                        義大利植鞣真皮工藝 · 限量典藏發表
                      </h4>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-slate-300">
                          全館滿 NT$ 1,500 即享免運 · 結帳享 85 折
                        </span>
                        <span className="px-3 py-1 bg-white text-slate-950 font-bold text-xs rounded-lg shadow-sm">
                          SHOP NOW →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step D: Artistic QR Code */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-5">
                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center font-mono border border-emerald-200 text-sm">
                      D
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        藝術二維條碼（推薦工具：Quick QR Art / Stable Diffusion + ControlNet）
                      </h3>
                      <span className="text-xs text-slate-500">
                        高容錯率 (Level H 30%) · ControlNet 權重融合 · 品牌專屬燙金皮革花紋
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg font-semibold">
                    工具：ControlNet / Quick QR Art
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 space-y-3 text-xs text-slate-600 leading-relaxed">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1.5">
                      <span className="font-bold text-slate-900 block">
                        操作方法與實戰要領：
                      </span>
                      <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                        <li>
                          <strong className="text-slate-800">設定高容錯率二維碼：</strong>
                          輸入網店網址（如 <code>r11111023.myshopify.com</code>），將容錯率（Error Correction）設定為最高等級 <strong>H (30%)</strong>，即使二維碼有近三分之一被藝術化紋理覆蓋，手機鏡頭依然能快速解析。
                        </li>
                        <li>
                          <strong className="text-slate-800">ControlNet 條件約束控制：</strong>
                          在 Stable Diffusion 中載入 QR Code Monster 模型，將 ControlNet Weight 設定在 <strong>0.80 - 0.88</strong> 之間，確保二維碼在藝術視覺與光學可識別性之間取得完美平衡。
                        </li>
                        <li>
                          <strong className="text-slate-800">融入品牌提示詞（Prompts）：</strong>
                          加入「luxury leather goods, subtle golden embossed lines, minimalist botanical motif, elegant black and gold」，生成與品牌包款氣質契合的藝術圖騰。
                        </li>
                        <li>
                          <strong className="text-slate-800">全方位實體與數位應用：</strong>
                          印製於包裹隨箱牛皮紙感謝卡、實體展售會立牌及商品吊牌，顯著提高顧客回購與追蹤社群的意願。
                        </li>
                      </ol>
                    </div>
                  </div>

                  {/* QR code live visual */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-3">
                    <div className="p-3 bg-white rounded-2xl shadow-lg border-2 border-amber-400/40 relative group">
                      <svg
                        className="w-36 h-36 text-slate-950"
                        viewBox="0 0 100 100"
                        fill="currentColor"
                      >
                        <rect x="5" y="5" width="25" height="25" rx="3" fill="#0F172A" />
                        <rect x="9" y="9" width="17" height="17" fill="white" />
                        <rect x="13" y="13" width="9" height="9" fill="#1A4D2E" />

                        <rect x="70" y="5" width="25" height="25" rx="3" fill="#0F172A" />
                        <rect x="74" y="9" width="17" height="17" fill="white" />
                        <rect x="78" y="13" width="9" height="9" fill="#1A4D2E" />

                        <rect x="5" y="70" width="25" height="25" rx="3" fill="#0F172A" />
                        <rect x="9" y="74" width="17" height="17" fill="white" />
                        <rect x="13" y="78" width="9" height="9" fill="#1A4D2E" />

                        <circle cx="45" cy="15" r="3" fill="#D97706" />
                        <circle cx="55" cy="20" r="3" fill="#1A4D2E" />
                        <circle cx="40" cy="35" r="3" fill="#0F172A" />
                        <circle cx="50" cy="45" r="4" fill="#D97706" />
                        <circle cx="60" cy="35" r="3" fill="#1A4D2E" />

                        <rect x="35" y="50" width="8" height="8" rx="2" fill="#0F172A" />
                        <rect x="55" y="50" width="8" height="8" rx="2" fill="#D97706" />
                        <rect x="70" y="40" width="8" height="8" rx="2" fill="#1A4D2E" />
                        <rect x="45" y="65" width="8" height="8" rx="2" fill="#0F172A" />
                        <rect x="65" y="75" width="8" height="8" rx="2" fill="#D97706" />
                        <rect x="80" y="65" width="8" height="8" rx="2" fill="#1A4D2E" />
                        <rect x="80" y="85" width="8" height="8" rx="2" fill="#0F172A" />

                        <rect x="42" y="42" width="16" height="16" rx="4" fill="#0F172A" />
                        <text
                          x="50"
                          y="53"
                          textAnchor="middle"
                          fill="#FBBF24"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          R11
                        </text>
                      </svg>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-bold text-white block">
                        R11111023 品牌專屬藝術二維條碼
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono block">
                        掃描直達：r11111023.myshopify.com
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={onAddProduct}
        config={config}
      />

      {/* Order Receipt Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900">
                訂單憑證與出貨明細 ({selectedOrderDetails.orderNumber})
              </span>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-slate-400 hover:text-slate-700 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">收件人</span>
                <span className="font-semibold text-slate-900">
                  {selectedOrderDetails.customerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">配送地址</span>
                <span className="text-slate-800 truncate max-w-[220px]">
                  {selectedOrderDetails.shippingAddress}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">宅配單號 (Tracking)</span>
                <span className="font-mono font-bold text-emerald-800">
                  {selectedOrderDetails.trackingNumber || 'TC-9482104928TW'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">付款方式</span>
                <span className="text-slate-800">
                  {selectedOrderDetails.paymentMethod}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1">
                <span className="text-slate-400 block mb-1">明細項目：</span>
                {selectedOrderDetails.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {i.product.name} x{i.quantity}
                    </span>
                    <span className="font-mono">
                      {config.currencySymbol}{' '}
                      {(i.product.price * i.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-sm">
                <span>總結帳金額</span>
                <span className="font-mono text-emerald-800">
                  {config.currencySymbol}{' '}
                  {selectedOrderDetails.total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="w-full py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              關閉憑證
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
