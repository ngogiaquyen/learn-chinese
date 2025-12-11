// app/shop/page.tsx
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";

import ShopHeader from "../components/shop/ShopHeader";
import ShopTabs from "../components/shop/ShopTabs";
import ShopItemCard from "../components/shop/ShopItemCard";
import ShopConfirmModal from "../components/shop/ShopConfirmModal";
import ShopSuccessAnimation from "../components/shop/ShopSuccessAnimation";
import { ShopItem } from "@prisma/client";

type TabType = "PET" | "THEME" | "AVATAR" | "SKIN" | "MUSIC";

export default function ShopPage() {
  const [coins, setCoins] = useState(2500);
  const [inventory, setInventory] = useState<number[]>([]);
  const [activePet, setActivePet] = useState<number | null>(null);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("PET");

  const [confirmItem, setConfirmItem] = useState<{ id: number; price: number; name: string } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load dữ liệu từ API
  useEffect(() => {
    const loadData = async () => {
      const res = await fetch("/api/shop");
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setCoins(data.coins);
        setInventory(data.inventory);
        setActivePet(data.activePet);
        console.log(data.activePet);
        console.log(data.shopItems)
        setShopItems(data.shopItems);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredItems = shopItems.filter((item) => item.type === activeTab);

  const buyItem = (id: number, price: number, name: string) => {
    if (inventory.includes(id)) return alert("Bạn đã sở hữu vật phẩm này rồi!");
    if (coins < price) return alert("Không đủ xu!");
    setConfirmItem({ id, price, name });
  };

  const confirmPurchase = async () => {
    if (!confirmItem) return;
    console.log(JSON.stringify({
        action: "buy",
        itemId: confirmItem.id,
        price: confirmItem.price,
      }),)
    const res = await fetch("/api/shop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "buy",
        itemId: confirmItem.id,
        price: confirmItem.price,
      }),
    });
    if (res.ok) {
      setCoins((prev) => prev - confirmItem.price);
      setInventory((prev) => [...prev, confirmItem.id]);
      if (confirmItem.id) setActivePet(confirmItem.id);
      setConfirmItem(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    } else {
      const err = await res.json();
      alert(err.error || "Có lỗi xảy ra");
    }
  };

  const isOwned = (id: number) => inventory.includes(id);

  if (loading) {
    return <div className="text-center py-20 text-xl">Đang tải cửa hàng...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 text-gray-100 px-4 py-12 relative">
      <div className="max-w-7xl mx-auto">
        {/* <ShopHeader coins={coins} activePetAnimation={activePet ? shopItems.find((i) => i.id === activePet)?.lottieUrl : null} /> */}
        <ShopHeader coins={coins} activePetAnimation={shopItems.find((item) => String(item.id) === String(activePet))?.lottieUrl ?? null}/>

        <ShopTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="wait">
            {filteredItems.map((item) => (
              <ShopItemCard
                key={item.id}
                item={item}
                isOwned={isOwned(item.id)}
                onBuy={buyItem}
                animationData={item.type === "PET" ? item.lottieUrl : undefined}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <ShopConfirmModal
        show={!!confirmItem}
        onClose={() => setConfirmItem(null)}
        onConfirm={confirmPurchase}
        itemName={confirmItem?.name || ""}
        price={confirmItem?.price || 0}
      />

      <ShopSuccessAnimation show={showSuccess} />
    </div>
  );
}