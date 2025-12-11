// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import { ShopItem } from "@prisma/client";
import Image from "next/image";
import { useSession } from "next-auth/react";

import QRShowButton from "./components/QRShowButton";
import QRScanButton from "./components/QRScanButton";
import MyQRModal from "./components/MyQRModal";
import ScanQRModal from "./components/ScanQRModal";

type TabType = "PET" | "THEME" | "AVATAR" | "SKIN" | "MUSIC";

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

  // Modal QR
  const [showMyQR, setShowMyQR] = useState(false);
  const [showScanQR, setShowScanQR] = useState(false);

  // Lấy thông tin user từ session
  const currentUser = session?.user
    ? { id: Number(session.user.id), name: session.user.name || "Người chơi" }
    : null;

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

  // Load pet animation
  useEffect(() => {
    if (!activePet || shopItems.length) return;
    const pet = shopItems.find(i => i.id === activePet);
    if (!pet?.lottieUrl) return;

    setIsPetLoading(true);
    fetch(pet.lottieUrl)
      .then(r => r.json())
      .then(setPetAnimationData)
      .finally(() => setIsPetLoading(false));
  }, [activePet, shopItems]);

  const changeActive = async (type: TabType, itemId: number) => {
    const res = await fetch("/api/shop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setActive", type: type.toLowerCase(), itemId }),
    });
    if (res.ok) {
      if (type === "PET") setActivePet(itemId);
      if (type === "AVATAR") setActiveAvatar(itemId);
      if (type === "THEME") setActiveTheme(itemId);
    }
  };

  const ownedItems = shopItems.filter(item => inventory.includes(item.id) && item.type === activeTab);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black flex items-center justify-center">
        <p className="text-4xl font-bold text-yellow-400 animate-pulse">Đang tải kho đồ...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <div className="text-center py-20 text-2xl">Vui lòng đăng nhập</div>;
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-950 via-purple-900/30 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-16">
          <motion.h1
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-7xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"
          >
            Kho đồ của bạn
          </motion.h1>

          <div className="flex items-center gap-8">
            {/* Pet đang dùng */}
            <div className="relative mb-6 lg:mb-0">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-500 shadow-2xl">
                {isPetLoading ? (
                  <div className="w-full h-full bg-gray-700 animate-pulse" />
                ) : petAnimationData ? (
                  <Lottie animationData={petAnimationData} loop autoplay />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400 text-sm">
                    Chưa có pet
                  </div>
                )}
              </div>
              <div className="absolute -bottom-3 -right-3 bg-green-600 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                Đang dùng
              </div>
            </div>

            {/* Số xu + 2 nút QR */}
            <div className="flex flex-col items-center gap-6">
              <div className="bg-gradient-to-r from-yellow-600 to-orange-600 px-10 py-5 rounded-2xl shadow-2xl flex items-center gap-5 text-4xl font-bold">
                <span>{coins.toLocaleString()}</span>
                <span className="text-2xl">xu</span>
              </div>

              <div className="flex gap-6">
                <QRShowButton onClick={() => setShowMyQR(true)} />
                <QRScanButton onClick={() => setShowScanQR(true)} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {(["PET", "AVATAR", "THEME", "SKIN", "MUSIC"] as TabType[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-10 py-4 rounded-2xl font-bold text-xl transition-all backdrop-blur border-2 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl"
                  : "bg-gray-800/60 border-gray-700 hover:bg-gray-700"
              }`}
            >
              {tab === "PET" ? "Pet" : tab === "AVATAR" ? "Avatar" : tab === "THEME" ? "Chủ đề" : tab === "SKIN" ? "Skin" : "Nhạc"}
            </button>
          ))}
        </div>

        {/* Danh sách item */}
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {ownedItems.map(item => {
              const isActive = 
                (item.type === "PET" && item.id === activePet) ||
                (item.type === "AVATAR" && item.id === activeAvatar) ||
                (item.type === "THEME" && item.id === activeTheme);

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -15 }}
                  className="bg-gray-800/70 backdrop-blur border border-gray-700 rounded-3xl overflow-hidden shadow-2xl hover:shadow-purple-600/40 transition-all"
                >
                  {/* Ảnh hoặc Lottie */}
                  <div className="h-64 bg-gray-900 flex items-center justify-center relative">
                    {item.type === "PET" && item.lottieUrl ? (
                      <LottiePreview lottieUrl={item.lottieUrl} />
                    ) : (
                      <Image
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        width={256}
                        height={256}
                        className="w-48 h-48 object-cover rounded-2xl"
                      />
                    )}
                    {isActive && (
                      <div className="absolute top-4 right-4 bg-green-600 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                        Đang dùng
                      </div>
                    )}
                  </div>

                  <div className="p-6 text-center">
                    <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                    <p className="text-gray-400 text-sm mb-6">{item.description || "Không có mô tả"}</p>
                    {!isActive && (
                      <button
                        onClick={() => changeActive(item.type as TabType, item.id)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-8 py-4 rounded-2xl font-bold text-lg"
                      >
                        Sử dụng
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* 2 Modal QR */}
      <MyQRModal isOpen={showMyQR} onClose={() => setShowMyQR(false)} user={currentUser} />
      <ScanQRModal isOpen={showScanQR} onClose={() => setShowScanQR(false)} />
    </div>
  );
}

// Component nhỏ preview Lottie
function LottiePreview({ lottieUrl }: { lottieUrl: string }) {
  const [data, setData] = useState<object | null>(null);
  useEffect(() => {
    fetch(lottieUrl).then(r => r.json()).then(setData);
  }, [lottieUrl]);
  if (!data) return <div className="w-48 h-48 bg-gray-700 rounded-2xl animate-pulse" />;
  return <Lottie animationData={data} loop autoplay style={{ width: 200, height: 200 }} />;
}