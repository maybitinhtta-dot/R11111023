import React, { useState } from 'react';
import { StoreConfig, Product } from '../../types/store';
import { initialProducts } from '../../data/initialData';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Store,
  Palette,
  CreditCard,
  Truck,
  Globe2,
  Share2,
  ShoppingBag,
  Zap,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

interface StoreCreationWizardProps {
  currentConfig: StoreConfig;
  onSaveConfig: (config: StoreConfig, seededProducts?: Product[]) => void;
  onComplete: () => void;
}

export const StoreCreationWizard: React.FC<StoreCreationWizardProps> = ({
  currentConfig,
  onSaveConfig,
  onComplete,
}) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<StoreConfig>({ ...currentConfig });
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    'online',
    'pos',
    'instagram',
    'google',
  ]);
  const [loadDemoProducts, setLoadDemoProducts] = useState<boolean>(true);
  const [isProvisioning, setIsProvisioning] = useState<boolean>(false);
  const [provisionProgress, setProvisionProgress] = useState<number>(0);
  const [provisionLog, setProvisionLog] = useState<string>('準備初始化商店環境...');

  const industries = [
    '頂級工藝真皮包袋與皮件配飾 (Luxury Leather Bags)',
    '獨立設計師高級時裝與配件',
    '當代居家工藝與生活美學',
    '天然植萃美妝與有機香氛',
    '極簡 3C 數位與科技硬體配件',
  ];

  const themes = [
    {
      id: 'craft',
      name: 'Craft 工藝質韻',
      badge: '熱門推薦',
      desc: '襯線典雅字體搭配大器版面，專為注重細節、質感的匠人與生活品牌設計。',
      color: '#1A4D2E',
      font: 'Serif + Sans',
    },
    {
      id: 'dawn',
      name: 'Dawn 現代簡約',
      badge: '極簡俐落',
      desc: '高純白留白空間，突出產品攝影本質，載入速度超快，全球熱門經典主題。',
      color: '#18181B',
      font: 'Clean Sans',
    },
    {
      id: 'horizon',
      name: 'Horizon 奢華大地',
      badge: '高端品味',
      desc: '沉穩暖調大地色系與細緻微漸層，烘托頂級選物與珠寶香氛之尊榮格調。',
      color: '#845EC2',
      font: 'Display Grotesque',
    },
    {
      id: 'pulse',
      name: 'Pulse 街頭動感',
      badge: '潮流先鋒',
      desc: '高對比色塊與大膽現代排版，完美契合街頭潮流、潮牌滑板與運動服飾。',
      color: '#0052FF',
      font: 'Condensed Sans',
    },
  ];

  const handleChannelToggle = (channelId: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleLaunchStore = async () => {
    setIsProvisioning(true);
    setProvisionProgress(15);
    setProvisionLog('正在向 Shopify 核心節點申請註冊商店 handle...');

    await new Promise((r) => setTimeout(r, 600));
    setProvisionProgress(40);
    setProvisionLog(`配置全球 SSL 憑證與 DNS: ${formData.handle}.myshopify.com`);

    await new Promise((r) => setTimeout(r, 700));
    setProvisionProgress(68);
    setProvisionLog(`部署旗艦主題「${formData.theme.toUpperCase()}」與響應式 Liquid 模組...`);

    await new Promise((r) => setTimeout(r, 600));
    setProvisionProgress(88);
    setProvisionLog('初始化 Shopify Payments 金流、全通路庫存與示範型錄...');

    await new Promise((r) => setTimeout(r, 600));
    setProvisionProgress(100);
    setProvisionLog('✨ 商店建立成功！即刻為您開啟線上旗艦前台...');

    await new Promise((r) => setTimeout(r, 500));
    setIsProvisioning(false);
    onSaveConfig(formData, loadDemoProducts ? initialProducts : undefined);
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Provisioning Overlay Modal */}
      {isProvisioning && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                正在為您申請建立 Shopify 線上商店
              </h3>
              <p className="text-sm text-slate-500 font-mono">
                {formData.handle}.myshopify.com
              </p>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${provisionProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>自動配置進度</span>
                <span>{provisionProgress}%</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-mono">
              {provisionLog}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Shopify 企業級安全規格 · 99.99% 正常運作時間保證</span>
            </div>
          </div>
        </div>
      )}

      {/* Header banner */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
              Shopify Store Application & Launch Engine
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              申請建立新線上商店
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              完成四步智慧設定，即刻開通專屬品牌旗艦店與全通路銷售後台。
            </p>
          </div>

          <button
            onClick={handleLaunchStore}
            className="self-start md:self-auto px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            快速一鍵完成建立 (示範模式)
          </button>
        </div>

        {/* Stepper tabs */}
        <div className="grid grid-cols-4 gap-2 mt-6">
          {[
            { num: 1, title: '品牌基本資料' },
            { num: 2, title: '銷售渠道與市場' },
            { num: 3, title: '主題與風格調性' },
            { num: 4, title: '商品型錄與確認' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`p-3 text-left rounded-xl border transition-all ${
                step === s.num
                  ? 'bg-white border-emerald-600 shadow-xs ring-1 ring-emerald-600/20'
                  : step > s.num
                  ? 'bg-slate-50 border-slate-200 text-slate-600'
                  : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center font-mono ${
                    step === s.num
                      ? 'bg-emerald-600 text-white'
                      : step > s.num
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </span>
                <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                  Step 0{s.num}
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-800 truncate">
                {s.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                步驟 1：定義您的品牌與網址
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                為您的 Shopify 商店命名並指定專屬的 myshopify.com 網址代號。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  商店中文 / 品牌全名
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="例如：AURA ATELIER · 質簡工藝選品"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Shopify 專屬子網域代稱 (Handle)
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={formData.handle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        handle: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                      })
                    }
                    placeholder="aura-atelier"
                    className="w-full px-3.5 py-2.5 border border-r-0 border-slate-200 rounded-l-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <span className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-r-xl text-xs text-slate-500 font-mono whitespace-nowrap">
                    .myshopify.com
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  主要經營產業 / 商品類別
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                >
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  自訂獨立網域 (可選)
                </label>
                <input
                  type="text"
                  value={formData.customDomain || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, customDomain: e.target.value })
                  }
                  placeholder="www.aura-atelier.co"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                品牌核心精神 / Slogan 標語
              </label>
              <textarea
                rows={2}
                value={formData.tagline}
                onChange={(e) =>
                  setFormData({ ...formData, tagline: e.target.value })
                }
                placeholder="例如：凝聚匠心工藝與自然材質，為日常居所構築純粹詩意。"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                步驟 2：銷售渠道與全通路開通
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Shopify 支援將商品一處上架、多渠道同步銷售。請選取欲開通的渠道。
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  id: 'online',
                  title: '線上旗艦商店 (Online Store)',
                  desc: '專屬高速購物官網，內建購物車與快速結帳頁面。',
                  icon: Globe2,
                  required: true,
                },
                {
                  id: 'pos',
                  title: 'Shopify POS 實體門市',
                  desc: '實體店 iPad/手機收銀，線上線下庫存雙向自動同步。',
                  icon: Store,
                },
                {
                  id: 'instagram',
                  title: 'Instagram & Facebook 導購',
                  desc: '社群貼文與限動直接標註商品，消費者一鍵點擊買單。',
                  icon: Share2,
                },
                {
                  id: 'google',
                  title: 'Google Shopping & 搜尋',
                  desc: '將商品自動同步至 Google 搜尋引擎與購物分頁。',
                  icon: ShoppingBag,
                },
              ].map((channel) => {
                const isSelected = selectedChannels.includes(channel.id);
                const IconComponent = channel.icon;
                return (
                  <div
                    key={channel.id}
                    onClick={() =>
                      !channel.required && handleChannelToggle(channel.id)
                    }
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-900">
                          {channel.title}
                        </span>
                        {channel.required ? (
                          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                            必備基礎
                          </span>
                        ) : (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {channel.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                  基礎結帳貨幣
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => {
                    const c = e.target.value as 'TWD' | 'USD' | 'EUR' | 'JPY';
                    const symbols: Record<string, string> = {
                      TWD: 'NT$',
                      USD: '$',
                      EUR: '€',
                      JPY: '¥',
                    };
                    setFormData({
                      ...formData,
                      currency: c,
                      currencySymbol: symbols[c] || '$',
                    });
                  }}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                >
                  <option value="TWD">新台幣 (TWD · NT$)</option>
                  <option value="USD">美元 (USD · $)</option>
                  <option value="JPY">日圓 (JPY · ¥)</option>
                  <option value="EUR">歐元 (EUR · €)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-slate-500" />
                  免運費門檻金額 ({formData.currencySymbol})
                </label>
                <input
                  type="number"
                  value={formData.freeShippingThreshold}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      freeShippingThreshold: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                步驟 3：選擇 Shopify 旗艦主題風格
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                所有主題均具備頂尖行動端體驗與極速渲染效能，您隨時可在後台調整細節。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {themes.map((th) => {
                const isSelected = formData.theme === th.id;
                return (
                  <div
                    key={th.id}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        theme: th.id as 'dawn' | 'horizon' | 'craft' | 'pulse',
                        accentColor: th.color,
                      })
                    }
                    className={`p-5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-slate-900 text-white shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ backgroundColor: th.color }}
                        />
                        <span className="font-bold text-base">{th.name}</span>
                      </div>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {th.badge}
                      </span>
                    </div>

                    <p
                      className={`text-xs mb-3 leading-relaxed ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {th.desc}
                    </p>

                    <div
                      className={`text-[11px] font-mono flex items-center justify-between pt-3 border-t ${
                        isSelected ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-400'
                      }`}
                    >
                      <span>排版結構：{th.font}</span>
                      {isSelected && (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 已選定
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="text-xs font-semibold text-slate-700">
                頂部公告列內容 (Announcement Bar)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.announcementEnabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      announcementEnabled: e.target.checked,
                    })
                  }
                  id="ann-toggle"
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label
                  htmlFor="ann-toggle"
                  className="text-xs text-slate-600 cursor-pointer select-none"
                >
                  啟用全館頂部促銷/免運公告條
                </label>
              </div>
              <input
                type="text"
                value={formData.announcementText}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    announcementText: e.target.value,
                  })
                }
                placeholder="例如：新店開幕慶：全館消費滿 NT$ 1,500 即享免運"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                步驟 4：商品型錄預載與確認申請
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                您可以選擇直接載入高解析精選商品庫，以便立刻體驗前台購物與後台訂單管理流程。
              </p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-3">
              <input
                type="checkbox"
                id="load-demo"
                checked={loadDemoProducts}
                onChange={(e) => setLoadDemoProducts(e.target.checked)}
                className="mt-1 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="load-demo" className="cursor-pointer">
                <span className="text-sm font-bold text-slate-900 block">
                  預載 6 款 R11111023 頂級工藝真皮包袋 (推薦)
                </span>
                <span className="text-xs text-slate-600 mt-0.5 block">
                  包含經典義大利植鞣托特包、純黃銅鎖扣馬鞍包、橄欖綠頭層全粒面後背包、公爵夫人立體手提包與商務公事包，具備完整高解析商品大片、規格與庫存數據。
                </span>
              </label>
            </div>

            {/* Application Summary Box */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                申請內容總覽
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">商店名稱</span>
                  <span className="font-semibold text-slate-800">
                    {formData.name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">二級網域名稱</span>
                  <span className="font-mono text-emerald-700 font-semibold">
                    {formData.handle}.myshopify.com
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">旗艦主題模版</span>
                  <span className="font-semibold text-slate-800 uppercase">
                    {formData.theme}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">結帳貨幣</span>
                  <span className="font-semibold text-slate-800">
                    {formData.currency} ({formData.currencySymbol})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">開通銷售渠道</span>
                  <span className="font-semibold text-slate-800">
                    {selectedChannels.length} 個通路已就緒
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">免運門檻</span>
                  <span className="font-mono text-slate-800 font-semibold">
                    {formData.currencySymbol}{' '}
                    {formData.freeShippingThreshold.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action button bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> 上一步
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              下一步 <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleLaunchStore}
              className="px-6 py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-lg font-sans"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              確認申請並建立線上商店
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
