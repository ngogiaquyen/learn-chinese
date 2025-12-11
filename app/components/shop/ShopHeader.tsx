// app/components/shop/ShopHeader.tsx
"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

type ShopHeaderProps = {
  coins: number;
  activePetAnimation: string | null;
};

export default function ShopHeader({ coins, activePetAnimation }: ShopHeaderProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    if (!activePetAnimation) {
      setAnimationData(null);
      return;
    }

    const loadAnimation = async () => {
      try {
        const res = await fetch(activePetAnimation);
        if (!res.ok) throw new Error("Không tải được animation");
        const data = await res.json();
        setAnimationData(data);
      } catch (err) {
        console.error("Lỗi tải animation:", err);
        setAnimationData(null);
      }
    };

    loadAnimation();
  }, [activePetAnimation]);

  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold">Cửa hàng</h1>

      <div className="flex items-center gap-6">
        {/* Pet đang dùng */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg shadow-indigo-500/30">
            {animationData ? (
              <Lottie
                animationData={animationData}
                loop
                autoplay
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400 text-sm">
                Chưa có
              </div>
            )}
          </div>

          <div className="absolute -bottom-2 -right-2 bg-green-600 text-xs font-bold px-2 py-1 rounded-full">
            Đang dùng
          </div>
        </div>

        {/* Số xu */}
        <div className="flex items-center gap-2 bg-yellow-600/20 px-4 py-2 rounded-full">
          <span className="text-yellow-400 font-bold">{coins.toLocaleString()}</span>
          <span className="text-yellow-400">xu</span>
        </div>
      </div>
    </div>
  );
}