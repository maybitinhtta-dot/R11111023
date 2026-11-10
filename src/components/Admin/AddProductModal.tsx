import React, { useState } from 'react';
import { Product, StoreConfig } from '../../types/store';
import { X, Plus, Upload, Image as ImageIcon } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
  config: StoreConfig;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  config,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('Túi Tote & Công Sở');
  const [price, setPrice] = useState<number>(3200000);
  const [compareAtPrice, setCompareAtPrice] = useState<number>(3800000);
  const [costPrice, setCostPrice] = useState<number>(1500000);
  const [stock, setStock] = useState<number>(20);
  const [description, setDescription] = useState<string>('');
  const [sku, setSku] = useState<string>(`R11-BAG-${Math.floor(100 + Math.random() * 900)}`);
  const [selectedImage, setSelectedImage] = useState<string>(
    '/src/assets/images/product_leather_bag_1794289413321.jpg'
  );
  const [variantsStr, setVariantsStr] = useState<string>('Nâu Bò Cổ Điển, Đen Tuyển Chọn, Kem Ánh Kim');

  const availableImages = [
    { label: 'Túi Tote Da Bò', path: '/src/assets/images/product_leather_bag_1794289413321.jpg' },
    { label: 'Túi Đeo Chéo', path: '/src/assets/images/product_crossbody_bag_1794290083038.jpg' },
    { label: 'Balo Da Olive', path: '/src/assets/images/product_leather_backpack_1794290082776.jpg' },
    { label: 'BST Túi Cao Cấp', path: '/src/assets/images/hero_handbag_editorial_1794290082407.jpg' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const variants = variantsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name,
      category,
      price: Number(price) || 0,
      compareAtPrice: Number(compareAtPrice) || undefined,
      costPrice: Number(costPrice) || 0,
      stock: Number(stock) || 0,
      image: selectedImage,
      description: description || '嚴選自然工藝材質，融合當代簡約美學。',
      sku,
      status: 'active',
      variants: variants.length > 0 ? variants : ['單一規格'],
      rating: 5.0,
      reviewCount: 1,
    };

    onAddProduct(newProd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="font-bold text-sm text-slate-900">
            新增商品至 Shopify 產品目錄
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              商品名稱 *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：原木手工雕刻置物盤"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                商品類別
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
              >
                <option value="Túi Tote & Công Sở">Túi Tote & Công Sở</option>
                <option value="Túi Đeo Chéo">Túi Đeo Chéo</option>
                <option value="Balo Da & Du Lịch">Balo Da & Du Lịch</option>
                <option value="Túi Xách Tay Quai Cầm">Túi Xách Tay Quai Cầm</option>
                <option value="Túi Đeo Vai & Kẹp Nách">Túi Đeo Vai & Kẹp Nách</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                商品編號 SKU
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                正式售價 ({config.currencySymbol})
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                原價/劃線價
              </label>
              <input
                type="number"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                進貨成本價
              </label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          {/* Stock inventory */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                初始庫存量 (件)
              </label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                規格選項 (逗號分隔)
              </label>
              <input
                type="text"
                value={variantsStr}
                onChange={(e) => setVariantsStr(e.target.value)}
                placeholder="例如：原木色, 曜石黑"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Image Selection */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">
              選擇商品代表圖
            </label>
            <div className="grid grid-cols-4 gap-2">
              {availableImages.map((img) => (
                <div
                  key={img.path}
                  onClick={() => setSelectedImage(img.path)}
                  className={`p-1.5 rounded-lg border cursor-pointer text-center transition-all ${
                    selectedImage === img.path
                      ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={img.path}
                    alt={img.label}
                    className="w-full aspect-[4/3] object-cover rounded mb-1"
                  />
                  <span className="text-[10px] text-slate-600 truncate block">
                    {img.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              商品特色敘述
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="敘述手工工藝、材質來源與日常使用建議..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              確認發布商品
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
