"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { a } from "framer-motion/client";

type ShopItem = {
  id: string;
  name: string;
  price: number;
  type: string;
  image: string;
  description: string;
};

type ShopItemCardProps = {
  item: ShopItem;
  isOwned: boolean;
  onBuy: (id: string, price: number, name: string) => void;
  animationData?: string | null; // URL string
};



export default function ShopItemCard({
  item,
  isOwned,
  onBuy,
  animationData,
}: ShopItemCardProps) {
  const [lottieData, setLottieData] = useState<object | null>(null);

  useEffect(() => {

    if (!animationData) {
      setLottieData(null);
      return;
    }
    

      const loadAnimation = async () => {
        try {
          const res = await fetch(animationData);
          if (!res.ok) throw new Error("Không tải được animation");
          const data = await res.json();
          setLottieData(data);
        } catch (err) {
          console.error("Lỗi tải animation:", err);
          setLottieData(null);
        }
      };

      loadAnimation();
  }, [animationData]);

  return (
    <div className="bg-gray-800 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
      <div className="relative h-40 bg-gray-900 flex items-center justify-center">
        {animationData ? (
          lottieData ? (
            <Lottie
              animationData={lottieData}
              loop
              autoplay
              style={{ width: "80%", height: "80%" }}
            />
          ) : (
            <div className="text-gray-500 animate-pulse">Đang tải animation...</div>
          )
        ) : (
          <img
            src={item.image}
            alt={item.name}
            className="w-32 h-32 object-cover"
          />
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold">{item.name}</h3>
        <p className="text-sm text-gray-400 mt-1">{item.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-yellow-400 font-bold">
            {item.price.toLocaleString()} xu
          </span>

          {isOwned ? (
            <span className="bg-green-600 px-3 py-1 rounded-full text-sm font-medium">
              Đã sở hữu
            </span>
          ) : (
            <button
              onClick={() => onBuy(item.id, item.price, item.name)}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-full text-sm font-medium transition"
            >
              Mua
            </button>
          )}
        </div>
      </div>
    </div>
  );
}