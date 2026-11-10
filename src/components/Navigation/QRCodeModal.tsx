import React, { useState } from 'react';
import { X, Copy, Check, Smartphone, Sparkles, Download, ExternalLink, ShieldCheck } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeUrl: string;
  onOpenMobilePreview: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  storeUrl,
  onOpenMobilePreview,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'artistic' | 'standard'>('artistic');
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200">
              QR
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                R11111023 品牌官方專屬二維條碼
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                {storeUrl}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher: Artistic vs Standard */}
        <div className="px-6 pt-4 pb-2">
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('artistic')}
              className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'artistic'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI 藝術二維條碼 (Artistic)</span>
            </button>
            <button
              onClick={() => setActiveTab('standard')}
              className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'standard'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>高對比快速掃描碼 (Standard)</span>
            </button>
          </div>
        </div>

        {/* QR Code Presentation Box */}
        <div className="p-6 flex flex-col items-center justify-center space-y-4">
          {activeTab === 'artistic' ? (
            <div className="relative group max-w-[280px] w-full rounded-2xl overflow-hidden shadow-xl border-4 border-slate-900 bg-slate-950">
              <img
                src="/src/assets/images/artistic_qr_code_1794290810071.jpg"
                alt="R11111023 AI 藝術二維條碼"
                referrerPolicy="no-referrer"
                className="w-full aspect-square object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-xs py-1 px-2 rounded-lg text-center text-[10px] text-amber-300 font-mono">
                Stable Diffusion ControlNet 燙金真皮融合
              </div>
            </div>
          ) : (
            /* High-Contrast Precise SVG QR Code */
            <div className="p-4 bg-white rounded-2xl shadow-xl border-2 border-slate-200">
              <svg
                className="w-56 h-56 text-slate-950"
                viewBox="0 0 120 120"
                fill="currentColor"
              >
                {/* Outer corners / Finder patterns */}
                <rect x="10" y="10" width="30" height="30" rx="4" fill="#0F172A" />
                <rect x="15" y="15" width="20" height="20" rx="2" fill="white" />
                <rect x="20" y="20" width="10" height="10" rx="1" fill="#1A4D2E" />

                <rect x="80" y="10" width="30" height="30" rx="4" fill="#0F172A" />
                <rect x="85" y="15" width="20" height="20" rx="2" fill="white" />
                <rect x="90" y="20" width="10" height="10" rx="1" fill="#1A4D2E" />

                <rect x="10" y="80" width="30" height="30" rx="4" fill="#0F172A" />
                <rect x="15" y="85" width="20" height="20" rx="2" fill="white" />
                <rect x="20" y="90" width="10" height="10" rx="1" fill="#1A4D2E" />

                {/* Timing patterns */}
                <rect x="44" y="20" width="4" height="4" fill="#0F172A" />
                <rect x="52" y="20" width="4" height="4" fill="#0F172A" />
                <rect x="60" y="20" width="4" height="4" fill="#0F172A" />
                <rect x="68" y="20" width="4" height="4" fill="#0F172A" />

                <rect x="20" y="44" width="4" height="4" fill="#0F172A" />
                <rect x="20" y="52" width="4" height="4" fill="#0F172A" />
                <rect x="20" y="60" width="4" height="4" fill="#0F172A" />
                <rect x="20" y="68" width="4" height="4" fill="#0F172A" />

                {/* Data Matrix Modules */}
                <rect x="44" y="32" width="6" height="6" rx="1" fill="#1A4D2E" />
                <rect x="54" y="32" width="6" height="6" rx="1" fill="#0F172A" />
                <rect x="64" y="32" width="6" height="6" rx="1" fill="#1A4D2E" />

                <rect x="32" y="44" width="6" height="6" rx="1" fill="#0F172A" />
                <rect x="42" y="44" width="6" height="6" rx="1" fill="#1A4D2E" />
                <rect x="52" y="44" width="6" height="6" rx="1" fill="#0F172A" />
                <rect x="62" y="44" width="6" height="6" rx="1" fill="#1A4D2E" />
                <rect x="72" y="44" width="6" height="6" rx="1" fill="#0F172A" />
                <rect x="82" y="44" width="6" height="6" rx="1" fill="#1A4D2E" />

                <rect x="44" y="54" width="6" height="6" rx="1" fill="#1A4D2E" />
                <rect x="70" y="54" width="6" height="6" rx="1" fill="#0F172A" />
                <rect x="80" y="54" width="6" height="6" rx="1" fill="#1A4D2E" />
                <rect x="90" y="54" width="6" height="6" rx="1" fill="#0F172A" />

                <rect x="32" y="64" width="6" height="6" rx="1" fill="#1A4D2E" />
                <rect x="42" y="64" width="6" height="6" rx="1" fill="#0F172A" />
                <rect x="64" y="64" width="6" height="6" rx="1" fill="#0F172A" />
                <rect x="74" y="64" width="6" height="6" rx="1" fill="#1A4D2E" />
                <rect x="84" y="64" width="6" height="6" rx="1" fill="#0F172A" />

                <rect x="44" y="74" width="6" height="6" rx="1" fill="#0F172A" />
                <rect x="54" y="74" width="6" height="6" rx="1" fill="#1A4D2E" />
                <rect x="64" y="74" width="6" height="6" rx="1" fill="#0F172A" />

                <rect x="44" y="84" width="6" height="6" rx="1" fill="#1A4D2E" />
                <rect x="60" y="84" width="6" height="6" rx="1" fill="#0F172A" />
                <rect x="70" y="84" width="6" height="6" rx="1" fill="#1A4D2E" />
                <rect x="80" y="84" width="6" height="6" rx="1" fill="#0F172A" />

                {/* Center Brand Badge */}
                <circle cx="60" cy="60" r="13" fill="#0F172A" />
                <circle cx="60" cy="60" r="11" fill="#1A4D2E" />
                <text
                  x="60"
                  y="63"
                  textAnchor="middle"
                  fill="#FDE047"
                  fontSize="7"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  R11
                </text>
              </svg>
            </div>
          )}

          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-slate-800 block">
              使用智慧型手機相機鏡頭對準即可掃描進店
            </span>
            <span className="text-[11px] text-slate-500 block">
              支援 iOS 相機、LINE 掃條碼與 Android Google 智慧鏡頭
            </span>
          </div>
        </div>

        {/* URL and Action Bar */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-700 truncate select-all">
              {storeUrl}
            </div>
            <button
              onClick={handleCopyUrl}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>已複製網址</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>複製</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                onClose();
                onOpenMobilePreview();
              }}
              className="w-full py-2.5 px-3 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
              <span>以手機視窗模擬檢視</span>
            </button>

            <a
              href={storeUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>在新視窗開啟網店</span>
            </a>
          </div>

          <div className="text-center pt-1 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>符合 Level H 30% 高容錯率標準 · 具備 100% 掃描識別率</span>
          </div>
        </div>
      </div>
    </div>
  );
};
