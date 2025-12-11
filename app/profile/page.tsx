// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import { ShopItem } from "@prisma/client";
import { useSession } from "next-auth/react";
import { AlertCircle } from "lucide-react";

import MyQRModal from "./components/MyQRModal";
import ScanQRModal from "./components/ScanQRModal";
import { QRScanButton, QRShowButton } from "./components/QRButton";
import ShopItemCard from "../components/shop/ShopItemCard";
import ShopTabs from "../components/shop/ShopTabs";
import ItemGridList from "../components/shop/ItemGridList";
import ShopHeader from "../components/shop/ShopHeader";

type TabType = "PET" | "AVATAR" | "THEME" | "SKIN" | "MUSIC";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  const [coins, setCoins] = useState(2500);
  const [inventory, setInventory] = useState<number[]>([]);
  const [activePet, setActivePet] = useState<number | null>(null);
  const [activeAvatar, setActiveAvatar] = useState<number | null>(null);
  const [activeTheme, setActiveTheme] = useState<number | null>(null);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("PET");
  const [petAnimationData, setPetAnimationData] = useState<object | null>(null);
  const [isPetLoading, setIsPetLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showMyQR, setShowMyQR] = useState(false);
  const [showScanQR, setShowScanQR] = useState(false);
  const [sellItem, setSellItem] = useState<ShopItem | null>(null);

  const currentUser = session?.user
    ? { id: Number(session.user.id), name: session.user.name || "Người chơi" }
    : null;

  // Load dữ liệu khi đăng nhập
  useEffect(() => {
    if (status === "loading") return;

    const loadData = async () => {
      const res = await fetch("/api/shop");
      if (res.ok) {
        const data = await res.json();
        setCoins(data.coins || 0);
        setInventory(data.inventory || []);
        setActivePet(data.activePet);
        setActiveAvatar(data.activeAvatar);
        setActiveTheme(data.activeTheme);
        setShopItems(data.shopItems || []);
      }
      setLoading(false);
    };
    loadData();
  }, [status]);

  // Load animation cho pet đang dùng
  useEffect(() => {
    if (!activePet || !shopItems.length) return;
    const pet = shopItems.find((i) => i.id === activePet);
    if (!pet?.lottieUrl) return;

    setIsPetLoading(true);
    fetch(pet.lottieUrl)
      .then((r) => r.json())
      .then(setPetAnimationData)
      .finally(() => setIsPetLoading(false));
  }, [activePet, shopItems]);

  // Refresh số xu realtime (dùng khi nhận/chuyển/bán)
  const refreshCoins = async () => {
    const res = await fetch("/api/shop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getCoins" }),
    });
    if (res.ok) {
      const data = await res.json();
      setCoins(data.coins);
    }
  };

  // Đặt vật phẩm làm active
  const changeActive = async (type: TabType, itemId: number) => {
    const res = await fetch("/api/shop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "setActive",
        type: type.toLowerCase(),
        itemId,
      }),
    });

    if (res.ok) {
      if (type === "PET") setActivePet(itemId);
      if (type === "AVATAR") setActiveAvatar(itemId);
      if (type === "THEME") setActiveTheme(itemId);
    }
  };

  // BÁN VẬT PHẨM
  const handleSell = async (itemId: number) => {
    const res = await fetch("/api/shop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "sell", itemId }),
    });

    const result = await res.json();

    if (res.ok) {
      // Cập nhật inventory (xóa item đã bán)
      setInventory((prev) => prev.filter((id) => id !== itemId));
      // Cập nhật số xu
      setCoins(result.coins);
      // Nếu item đang active → bỏ active
      if (activePet === itemId) setActivePet(null);
      if (activeAvatar === itemId) setActiveAvatar(null);
      if (activeTheme === itemId) setActiveTheme(null);
      // Đóng modal
      setSellItem(null);
    } else {
      alert(result.error || "Bán thất bại!");
    }
  };

  // Lọc vật phẩm đã sở hữu theo tab hiện tại
  const ownedItems = shopItems.filter(
    (item) => inventory.includes(item.id) && item.type === activeTab
  );

  // Loading & chưa đăng nhập
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black flex items-center justify-center">
        <p className="text-3xl sm:text-4xl font-bold text-yellow-400 animate-pulse">
          Đang tải kho đồ...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center py-20 text-2xl text-white">
        Vui lòng đăng nhập
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-900/20 to-black text-white">
      <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* HEADER */}
        <div className="flex flex-col items-center justify-between gap-2 mb-6">
          <ShopHeader
            title="Kho đồ của bạn"
            coins={coins}
            activeLottieUrl={
              shopItems.find((i) => i.id === activePet)?.lottieUrl ?? null
            }
          />

          <div className="flex flex-col items-center gap-6 w-full sm:flex-row sm:justify-start">
            <div className="flex gap-4">
              <QRShowButton onClick={() => setShowMyQR(true)} />
              <QRScanButton onClick={() => setShowScanQR(true)} />
            </div>
          </div>
        </div>

        {/* TABS */}
        <ShopTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* GRID VẬT PHẨM */}
        <ItemGridList
          items={ownedItems}
          columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
          emptyMessage="Bạn chưa sở hữu vật phẩm nào trong mục này"
          renderItem={(item) => {
            const isActive =
              (item.type === "PET" && item.id === activePet) ||
              (item.type === "AVATAR" && item.id === activeAvatar) ||
              (item.type === "THEME" && item.id === activeTheme);

            return (
              <ShopItemCard
                item={item}
                isOwned={true}
                isActive={isActive}
                onUse={() => changeActive(item.type as TabType, item.id)}
                onSell={() => setSellItem(item)}
              />
            );
          }}
        />
      </div>

      {/* MODAL XÁC NHẬN BÁN */}
      <AnimatePresence>
        {sellItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSellItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-red-500/50 rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-6">
                <AlertCircle className="w-20 h-20 text-red-500 mx-auto" />
                <h3 className="text-3xl font-bold">Xác nhận bán</h3>
                <p className="text-2xl text-yellow-400 font-bold">
                  "{sellItem.name}"
                </p>
                <p className="text-xl">
                  Nhận lại:{" "}
                  <span className="text-2xl font-bold text-green-400">
                    {Math.floor(sellItem.price * 0.7).toLocaleString()} xu
                  </span>
                </p>
                <p className="text-gray-400">
                  Hành động này không thể hoàn tác!
                </p>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setSellItem(null)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 py-4 rounded-xl font-bold text-lg transition"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => handleSell(sellItem.id)}
                    className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 py-4 rounded-xl font-bold text-lg transition"
                  >
                    Bán ngay
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Các modal QR */}
      <MyQRModal
        isOpen={showMyQR}
        onClose={() => setShowMyQR(false)}
        user={currentUser}
      />
      <ScanQRModal
        isOpen={showScanQR}
        onClose={() => setShowScanQR(false)}
        onCoinsUpdate={refreshCoins}
      />
    </div>
  );
}

// Component preview Lottie nhỏ gọn
function LottiePreview({ lottieUrl }: { lottieUrl: string }) {
  const [data, setData] = useState<object | null>(null);

  useEffect(() => {
    fetch(lottieUrl)
      .then((r) => r.json())
      .then(setData);
  }, [lottieUrl]);

  if (!data) {
    return <div className="w-32 h-32 bg-gray-700 rounded-2xl animate-pulse" />;
  }

  return (
    <Lottie
      animationData={data}
      loop
      autoplay
      style={{ width: 160, height: 160 }}
    />
  );
}
