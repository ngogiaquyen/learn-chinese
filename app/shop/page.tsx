"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Coins, Sparkles, Loader2 } from "lucide-react";

import ShopHeader from "../components/shop/ShopHeader";
import ShopTabs from "../components/shop/ShopTabs";
import ShopItemCard from "../components/shop/ShopItemCard";
import ShopSuccessAnimation from "../components/shop/ShopSuccessAnimation";
import { ShopItem } from "@prisma/client";
import ItemGridList from "../components/shop/ItemGridList";
import { ShopConfirmModal } from "../components/shop/ShopConfirmModal";

type TabType = "PET" | "THEME" | "AVATAR" | "SKIN" | "MUSIC";

export default function ShopPage() {
  const [coins, setCoins] = useState(2500);
  const [inventory, setInventory] = useState<number[]>([]);
  const [activePet, setActivePet] = useState<number | null>(null);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("PET");
  const [loading, setLoading] = useState(true);

  const [confirmItem, setConfirmItem] = useState<{
    id: number;
    price: number;
    name: string;
  } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch("/api/shop");
      if (res.ok) {
        const data = await res.json();
        setCoins(data.coins);
        setInventory(data.inventory || []);
        setActivePet(data.activePet);
        setShopItems(data.shopItems || []);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredItems = shopItems.filter((item) => item.type === activeTab);

  const buyItem = (id: number, price: number, name: string) => {
    if (inventory.includes(id)) {
      alert("Bạn đã sở hữu vật phẩm này rồi!");
      return;
    }
    if (coins < price) {
      alert("Không đủ xu để mua!");
      return;
    }
    setConfirmItem({ id, price, name });
  };

  const confirmPurchase = async () => {
    if (!confirmItem || processing) return;
    try {
      setProcessing(true);
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
        const { coins: newCoins } = await res.json();
        setCoins(newCoins ?? coins - confirmItem.price);
        setInventory((prev) => [...prev, confirmItem.id]);
        setConfirmItem(null);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        const err = await res.json();
        alert(err.error || "Mua thất bại!");
      }
    } finally {
      setProcessing(false);
    }
  };

  const isOwned = (id: number) => inventory.includes(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-2xl font-bold text-yellow-400 animate-pulse">
          Đang tải cửa hàng ma thuật...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-gray-100">
        <div className="relative overflow-hidden">
          {/* Background hiệu ứng */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 py-12">
            {/* Số xu + Pet đang dùng */}
            <ShopHeader
              title="Cửa hàng ma thuật"
              coins={coins}
              activeLottieUrl={
                shopItems.find((i) => i.id === activePet)?.lottieUrl ?? null
              }
            />

            {/* Tabs */}
            <ShopTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Danh sách item */}
            <ItemGridList
              items={filteredItems}
              columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
              emptyMessage="Chưa có sản phẩm nào trong mục này"
              renderItem={(item) => (
                <ShopItemCard
                  item={item}
                  isOwned={isOwned(item.id)}
                  onBuy={buyItem}
                />
              )}
            />
          </div>
        </div>

        {/* Modal xác nhận mua */}
        <ShopConfirmModal
          show={!!confirmItem}
          onClose={() => setConfirmItem(null)}
          onConfirm={confirmPurchase}
          itemName={confirmItem?.name || ""}
          price={confirmItem?.price || 0}
          processing={processing}
        />

        {/* Animation thành công */}
        <ShopSuccessAnimation show={showSuccess} />
      </div>
    </>
  );
}