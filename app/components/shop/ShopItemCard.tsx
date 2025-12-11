"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import Image from "next/image";
import { Coins, CheckCircle, Trash2, Loader2 } from "lucide-react";

type ShopItem = {
  id: number;
  name: string;
  price: number;
  type: string;
  image?: string | null;
  lottieUrl?: string | null;
  description?: string | null;
};

type Props = {
  item: ShopItem;
  isOwned: boolean;
  isActive?: boolean;
  onBuy?: (id: number, price: number, name: string) => Promise<void> | void;
  onUse?: () => Promise<void> | void;
  onSell?: () => Promise<void> | void;
};

export default function ShopItemCard({
  item,
  isOwned,
  isActive = false,
  onBuy,
  onUse,
  onSell,
}: Props) {
  const [lottieData, setLottieData] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item.lottieUrl) {
      fetch(item.lottieUrl)
        .then((r) => r.json())
        .then(setLottieData)
        .catch(() => setLottieData(null));
    }
  }, [item.lottieUrl]);

  const sellPrice = Math.floor(item.price * 0.7);

  const handleAction = async (action: () => Promise<void> | void) => {
    if (loading) return;
    try {
      setLoading(true);
      await action();
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative bg-gray-800/70 backdrop-blur-lg border border-gray-700 
                 rounded-2xl overflow-hidden shadow-xl hover:shadow-purple-600/40 
                 transition-all duration-300 group"
    >
      {/* Hover gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/15 via-pink-600/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* IMAGE / LOTTIE */}
      <div className="aspect-square bg-gray-900 flex items-center justify-center relative overflow-hidden">
        {item.lottieUrl && lottieData ? (
          <Lottie
            animationData={lottieData}
            loop
            autoplay
            className="w-full h-full object-contain p-2"
          />
        ) : item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            width={300}
            height={300}
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <div className="w-24 h-24 bg-gray-700 rounded-xl animate-pulse" />
        )}

        {/* Badge */}
        {isActive && (
          <div className="absolute top-2 right-2 bg-green-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
            <CheckCircle className="w-4 h-4" />
            Đang dùng
          </div>
        )}

        {isOwned && !isActive && (
          <div className="absolute top-2 left-2 bg-blue-600 px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
            Đã sở hữu
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="p-4 text-center space-y-3">
        <h3 className="text-lg font-semibold text-white truncate">
          {item.name}
        </h3>

        <p className="text-gray-400 text-xs line-clamp-2 min-h-8">
          {item.description || "Bí ẩn và tuyệt vời!"}
        </p>

        {/* PRICE */}
        <div className="flex items-center justify-center gap-1 text-xl font-bold text-yellow-400">
          <Coins className="w-5 h-5" />
          <span>{item.price.toLocaleString()}</span>
        </div>

        {/* SELL PRICE */}
        {onSell && (
          <p className="text-xs text-gray-400">
            Bán lại:{" "}
            <span className="text-green-400 font-bold">
              {sellPrice.toLocaleString()} xu
            </span>
          </p>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex gap-2">
          {/* SHOP – BUY */}
          {onBuy && !isOwned && (
            <button
              onClick={() => handleAction(() => onBuy(item.id, item.price, item.name))}
              disabled={loading}
              className={`w-full py-2 rounded-xl font-bold text-sm shadow-md transition transform ${
                loading
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:shadow-purple-600/50 hover:scale-105"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý...
                </span>
              ) : (
                "Mua ngay"
              )}
            </button>
          )}

          {/* SHOP – ALREADY OWNED */}
          {onBuy && isOwned && (
            <div className="w-full bg-gray-700 py-2 rounded-xl font-bold text-gray-400 text-sm text-center">
              Đã sở hữu
            </div>
          )}

          {/* PROFILE: USE + SELL */}
          {onUse && onSell && (
            <>
              {!isActive && (
                <button
                  onClick={() => handleAction(onUse)}
                  disabled={loading}
                  className={`flex-1 py-2 rounded-xl font-bold text-xs transition ${
                    loading
                      ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý...
                    </span>
                  ) : (
                    "Sử dụng"
                  )}
                </button>
              )}

              <button
                onClick={() => handleAction(onSell)}
                disabled={loading}
                className={`flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition ${
                  loading
                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500"
                }`}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                {loading ? "Đang xử lý..." : "Bán"}
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
