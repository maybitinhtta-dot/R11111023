import React from 'react';
import { ActiveTab, ViewportMode } from '../../types/store';
import { Store, LayoutDashboard, Sparkles, Monitor, Tablet, Smartphone, ShoppingBag } from 'lucide-react';

interface GlobalHeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  viewportMode: ViewportMode;
  setViewportMode: (mode: ViewportMode) => void;
  storeName: string;
  cartCount: number;
  openCart: () => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  activeTab,
  setActiveTab,
  viewportMode,
  setViewportMode,
  storeName,
  cartCount,
  openCart,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-slate-100 border-b border-slate-800 px-4 md:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base border border-emerald-500/30">
            S
          </div>
          <button
            onClick={() => setActiveTab('storefront')}
            className="text-left group transition-colors"
          >
            <span className="text-base font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors duration-200 whitespace-nowrap block">
              R11111023
            </span>
            <span className="text-xs text-slate-400 whitespace-nowrap block">
              {storeName.split('·')[0].trim()}
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setActiveTab('storefront')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'storefront'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Store className="w-4 h-4 text-emerald-400" />
            線上商店前台
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-indigo-400" />
            Shopify 賣家後台
          </button>

          <button
            onClick={() => setActiveTab('wizard')}
            className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'wizard'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            申請與重建嚮導
          </button>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Viewport switch only relevant when in storefront */}
          {activeTab === 'storefront' && (
            <div className="hidden sm:flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setViewportMode('desktop')}
                title="電腦桌機寬螢幕 (1440px)"
                className={`p-1.5 rounded transition-colors ${
                  viewportMode === 'desktop'
                    ? 'bg-slate-700 text-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewportMode('tablet')}
                title="平板預覽 (768px)"
                className={`p-1.5 rounded transition-colors ${
                  viewportMode === 'tablet'
                    ? 'bg-slate-700 text-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewportMode('mobile')}
                title="手機預覽 (390px)"
                className={`p-1.5 rounded transition-colors ${
                  viewportMode === 'mobile'
                    ? 'bg-slate-700 text-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}

          {activeTab === 'storefront' ? (
            <button
              onClick={openCart}
              className="relative px-3 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">購物袋</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center font-mono">
                  {cartCount}
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('storefront')}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              檢視前台商店
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
