import React, { useState } from 'react';
import { Product, StoreConfig, ViewportMode } from '../../types/store';
import {
  Search,
  ShoppingBag,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';

interface StorefrontViewProps {
  config: StoreConfig;
  products: Product[];
  onOpenProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  cartCount: number;
  onOpenCart: () => void;
  viewportMode: ViewportMode;
}

export const StorefrontView: React.FC<StorefrontViewProps> = ({
  config,
  products,
  onOpenProduct,
  onQuickAddToCart,
  cartCount,
  onOpenCart,
  viewportMode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  // Filtering & Sorting
  const filteredProducts = products
    .filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchQuery =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery && p.status === 'active';
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0; // featured
    });

  // Device frame wrapper styling
  const getViewportWrapperStyle = () => {
    if (viewportMode === 'mobile') {
      return 'max-w-[420px] mx-auto my-6 rounded-3xl shadow-2xl border-8 border-slate-900 overflow-hidden';
    }
    if (viewportMode === 'tablet') {
      return 'max-w-[820px] mx-auto my-6 rounded-2xl shadow-2xl border-8 border-slate-800 overflow-hidden';
    }
    return 'w-full';
  };

  return (
    <div className={`transition-all duration-300 ${getViewportWrapperStyle()}`}>
      <div className="bg-white min-h-screen text-slate-900 font-sans">
        {/* Top Announcement Bar */}
        {config.announcementEnabled && (
          <div
            className="text-xs py-2 px-4 text-center text-white tracking-wide font-medium flex items-center justify-center gap-2"
            style={{ backgroundColor: config.accentColor || '#1A4D2E' }}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{config.announcementText}</span>
          </div>
        )}

        {/* Storefront Navigation Bar */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-4 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
            {/* Brand Logo / Wordmark */}
            <a
              href="#store-top"
              className="text-lg md:text-xl font-bold tracking-tight text-slate-950 font-serif whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity"
            >
              {config.name}
            </a>

            {/* Nav links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-700">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`transition-colors hover:text-slate-950 ${
                  selectedCategory === 'all'
                    ? 'text-emerald-800 font-bold underline underline-offset-8'
                    : ''
                }`}
              >
                全部包款
              </button>
              {categories
                .filter((c) => c !== 'all')
                .map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`transition-colors hover:text-slate-950 ${
                      selectedCategory === cat
                        ? 'text-emerald-800 font-bold underline underline-offset-8'
                        : ''
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              <a
                href="#craft-story"
                className="transition-colors hover:text-slate-950"
              >
                品牌工藝故事
              </a>
            </nav>

            {/* Actions: Search & Bag */}
            <div className="flex items-center gap-3 shrink-0">
              {searchOpen ? (
                <div className="flex items-center bg-slate-100 rounded-lg px-2.5 py-1">
                  <Search className="w-4 h-4 text-slate-400 mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜尋包款名稱、材質或型號..."
                    autoFocus
                    className="text-xs bg-transparent focus:outline-none w-36 sm:w-48"
                  />
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchOpen(false);
                    }}
                    className="text-slate-400 hover:text-slate-700 ml-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-slate-600 hover:text-slate-950 rounded-lg hover:bg-slate-100 transition-colors"
                  title="搜尋商品"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onOpenCart}
                className="relative px-3.5 py-2 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">購物袋</span>
                <span className="font-mono bg-white text-slate-950 px-1.5 py-0.2 rounded-full text-[11px] font-bold">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Hero Showcase Banner */}
        <section className="relative bg-slate-950 text-white overflow-hidden" id="store-top">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[520px] items-stretch">
            {/* Content left */}
            <div className="lg:col-span-6 p-8 md:p-14 lg:p-16 flex flex-col justify-center space-y-6 z-10">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-300 font-mono">
                <span>{config.industry}</span>
                <span aria-hidden="true">·</span>
                <span>Shopify 旗艦官方店</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-serif text-balance leading-tight">
                {config.tagline || 'R11111023 · 頂級工藝真皮包袋'}
              </h1>

              <p className="text-sm md:text-base text-slate-300 max-w-lg leading-relaxed font-normal">
                探索全系列義大利頭層牛皮包款：經典托特大包、復古馬鞍包、都會後背包與優雅手提包。堅持職人手工雙面縫合，詮釋極簡純粹的當代品味。
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#collection-grid"
                  className="px-6 py-3 text-xs font-bold text-slate-950 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  探索全新包袋系列
                  <ArrowRight className="w-4 h-4" />
                </a>
                <span className="text-xs text-slate-400">
                  全館消費滿 {config.currencySymbol}{' '}
                  {config.freeShippingThreshold.toLocaleString()} 即享免運配送
                </span>
              </div>
            </div>

            {/* Hero Image Right */}
            <div className="lg:col-span-6 relative min-h-[340px] lg:min-h-full">
              <img
                src="/src/assets/images/hero_handbag_editorial_1794290082407.jpg"
                alt="R11111023 頂級工藝真皮包袋大片"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-slate-950 lg:via-transparent lg:to-transparent" />
            </div>
          </div>
        </section>

        {/* Value Proposition Strip */}
        <section className="border-b border-slate-200 bg-slate-50/70 py-6 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-emerald-800 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">黑貓宅急便免運</h4>
                <p className="text-[11px] text-slate-500">
                  滿 {config.currencySymbol} {config.freeShippingThreshold.toLocaleString()} 即享免運
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">100% 義大利頭層真皮</h4>
                <p className="text-[11px] text-slate-500">享 2 年皮革品質保證</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-800 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">職人手工雙面馬鞍縫</h4>
                <p className="text-[11px] text-slate-500">嚴選天然植鞣工藝</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-emerald-800 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">全台 7 天鑑賞退換</h4>
                <p className="text-[11px] text-slate-500">實體展示門市同步服務</p>
              </div>
            </div>
          </div>
        </section>

        {/* Collection & Catalog Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16" id="collection-grid">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold">
                R11111023 Handbag Collection
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-950 font-serif tracking-tight mt-1">
                旗艦工藝真皮包袋系列
              </h2>
            </div>

            {/* Filter & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Segmented Buttons */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-white text-slate-950 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    {cat === 'all' ? '全部包款' : cat}
                  </button>
                ))}
              </div>

              {/* Sort selector */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  <option value="featured">推薦排序</option>
                  <option value="price-asc">價格：由低至高</option>
                  <option value="price-desc">價格：由高至低</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Product Grid (3-column desktop) */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200 mt-8 space-y-3">
              <SlidersHorizontal className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                未找到相符的包款
              </h3>
              <p className="text-xs text-slate-500">
                請嘗試清除搜尋關鍵字或選擇其他系列分類。
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg"
              >
                重設所有篩選
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Image container: 65-75% height lead */}
                  <div
                    onClick={() => onOpenProduct(product)}
                    className="relative aspect-[4/3] bg-slate-100 cursor-pointer overflow-hidden"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Quick status text kicker */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-semibold text-slate-800 tracking-tight shadow-xs">
                      {product.stock <= 15 ? '熱銷補貨中' : '現貨在庫'}
                    </div>

                    {/* Compare-at discount flag */}
                    {product.compareAtPrice && (
                      <div className="absolute top-3 right-3 bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-tight">
                        SALE
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                        {product.category}
                      </div>

                      <h3
                        onClick={() => onOpenProduct(product)}
                        className="text-base font-bold text-slate-900 tracking-tight leading-snug cursor-pointer group-hover:text-emerald-800 transition-colors line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Price and Action row */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                          {config.currencySymbol}{' '}
                          {product.price.toLocaleString()}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                            {config.currencySymbol}{' '}
                            {product.compareAtPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onQuickAddToCart(product)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-slate-100 hover:bg-emerald-600 hover:text-white rounded-lg transition-colors flex items-center gap-1.5"
                          title="加入購物袋"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>選購</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Brand Story Section */}
        <section className="bg-slate-900 text-white py-16 px-4 sm:px-8 border-t border-slate-800" id="craft-story">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                About R11111023 Atelier
              </span>
              <h2 className="text-2xl md:text-3xl font-bold font-serif tracking-tight leading-snug">
                傳承義大利植鞣皮革工藝，點亮當代日常的從容優雅
              </h2>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                我們深信一件好包擁有一種安靜的力量。每一款 R11111023 包袋皆嚴選來自義大利托斯卡尼的頂級天然植鞣牛皮，經由資深工匠耗時數十道工序手工裁切、磨邊與縫製。無多餘繁複贅飾，讓皮革本質隨著時光淬鍊出獨一無二的溫潤光澤。
              </p>
              <div className="pt-2 text-xs text-slate-400 flex items-center gap-4">
                <span>· 100% 義大利原產認證真皮</span>
                <span>· 限量手工裁切縫製</span>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-slate-800">
              <img
                src="/src/assets/images/product_leather_bag_1794289413321.jpg"
                alt="R11111023 工藝皮件工作坊"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Storefront Footer */}
        <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <span className="font-bold text-slate-900 font-serif text-sm block">
                {config.name}
              </span>
              <span className="text-slate-400 mt-0.5 block">
                由 Shopify 全球電商架構支援 · SSL 安全加密認證
              </span>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-600">
              <a href="#store-top" className="hover:text-slate-950 transition-colors">
                隱私權政策
              </a>
              <a href="#store-top" className="hover:text-slate-950 transition-colors">
                服務條款
              </a>
              <a href="#store-top" className="hover:text-slate-950 transition-colors">
                配送與退換貨須知
              </a>
              <a href="#store-top" className="hover:text-slate-950 transition-colors">
                聯絡品牌客服
              </a>
            </div>

            <div className="text-center md:text-right font-mono text-slate-400">
              © 2026 {config.name.split('·')[0].trim()} Inc. 保留所有權利
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
