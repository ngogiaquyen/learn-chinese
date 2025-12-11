// components/shared/ShopHeader.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { Coins } from "lucide-react";

type ShopHeaderProps = {
  title?: string;
  coins: number;
  activeLottieUrl: string | null;
  showPet?: boolean;
};

export default function ShopHeader({
  title = "Cửa hàng ma thuật",
  coins,
  activeLottieUrl,
  showPet = true,
}: ShopHeaderProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!activeLottieUrl) {
      setAnimationData(null);
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        const res = await fetch(activeLottieUrl);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setAnimationData(data);
      } catch {
        setAnimationData(null);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    load();
  }, [activeLottieUrl]);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-8 mb-2">
      {/* Tiêu đề – nhỏ hơn, thanh lịch hơn */}
      <motion.h1
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold 
                   bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 
                   bg-clip-text text-transparent"
      >
        {title}
      </motion.h1>

      {/* Pet + Số xu – thu gọn */}
      <div className="flex items-center gap-6">
        {/* Số xu – nhỏ gọn, đẹp */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-yellow-600 to-orange-600 
                     px-6 py-3 sm:px-8 sm:py-2 
                     rounded-2xl shadow-xl 
                     flex items-center gap-3 
                     text-2xl sm:text-2xl font-bold
                     border-2 border-yellow-400/30"
        >
          <Coins className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-200" />
          <span>{coins.toLocaleString()}</span>
          <span className="text-lg sm:text-xl opacity-80">xu</span>
        </motion.div>
        {/* Pet đang dùng – nhỏ hơn */}
        {showPet && (
          <div className="relative">
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden 
                          border-4 ${
                            animationData
                              ? "border-purple-500"
                              : "border-gray-600"
                          } 
                          shadow-xl bg-gray-900/60`}
            >
              {isLoading ? (
                <div className="w-full h-full bg-gray-800 animate-pulse" />
              ) : animationData ? (
                <Lottie
                  animationData={animationData}
                  loop
                  autoplay
                  className="scale-125"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                  Chưa có
                </div>
              )}
            </div>

            {animationData && (
              <span className="absolute -bottom-2 right-2 bg-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                Đang dùng
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
