// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";

type TabType = "PET" | "THEME" | "AVATAR" | "SKIN" | "MUSIC";

export default function ProfilePage() {
  const [coins, setCoins] = useState(2500);
  const [inventory, setInventory] = useState<string[]>([]);
  const [activePet, setActivePet] = useState<string | null>(null);
  const [activeAvatar, setActiveAvatar] = useState<string | null>(null);
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [shopItems, setShopItems] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("PET");

  const [petAnimationData, setPetAnimationData] = useState<object | null>(null);
  const [isPetLoading, setIsPetLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load dữ liệu từ API
  useEffect(() => {
    const loadData = async () => {
      const res = await fetch("/api/shop");
      if (res.ok) {
        const data = await res.json();
        setCoins(data.coins);
        setInventory(data.inventory);
        setActivePet(data.activePet);
        setActiveAvatar(data.activeAvatar);
        setActiveTheme(data.activeTheme);
        setShopItems(data.shopItems);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // Load animation cho pet đang dùng (ở header)
  useEffect(() => {
    if (!activePet) {
      setPetAnimationData(null);
      return;
    }
    const petItem = shopItems.find((i) => i.id === activePet);
    const url = petItem?.lottieUrl;
    if (!url) return;

    setIsPetLoading(true);
    console.log("header loading pet animation from URL:", url); 
    fetch(url)
      .then((res) => res.json())
      .then((data) => setPetAnimationData(data))
      .catch(() => setPetAnimationData(null))
      .finally(() => setIsPetLoading(false));
  }, [activePet, shopItems]);

  const changeActive = async (type: TabType, itemId: string) => {
    const field = type === "PET" ? "activePet" : type === "AVATAR" ? "activeAvatar" : "activeTheme";
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

  const ownedItems = shopItems.filter((item) => inventory.includes(item.id) && item.type === activeTab);

  if (loading) return <div className="text-center py-20 text-xl">Đang tải kho đồ...</div>;

  return (
    <div className="w-full min-h-screen bg-gray-900 text-gray-100 px-4 py-12 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <h1 className="text-4xl font-bold mb-6 md:mb-0">Kho đồ của bạn</h1>

          <div className="flex items-center gap-8">
            {/* Pet đang dùng */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg shadow-indigo-500/50">
                {isPetLoading ? (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400 text-sm">Đang tải...</div>
                ) : petAnimationData ? (
                  <Lottie animationData={petAnimationData} loop autoplay style={{ width: "100%", height: "100%" }} />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400 text-sm">Chưa có</div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-600 text-xs font-bold px-3 py-1 rounded-full">
                Đang dùng
              </div>
            </div>

            {/* Số xu */}
            <div className="flex items-center gap-3 bg-yellow-600/20 px-6 py-3 rounded-full">
              <span className="text-yellow-400 text-2xl font-bold">{coins.toLocaleString()}</span>
              <span className="text-yellow-400">xu</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-10 border-b border-gray-700 pb-4">
          {["PET", "AVATAR", "THEME", "SKIN", "MUSIC"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as TabType)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === tab ? "bg-indigo-600 text-white" : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {tab === "PET" ? "Pet" : tab === "AVATAR" ? "Avatar" : tab === "THEME" ? "Theme" : tab === "SKIN" ? "Skin" : "Nhạc"}
            </button>
          ))}
        </div>

        {/* Danh sách item đã sở hữu */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="wait">
            {ownedItems.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-500 text-xl">
                Bạn chưa sở hữu item nào ở mục này.
              </div>
            ) : (
              ownedItems.map((item) => {
                const isPet = item.type === "PET";
                const isActive =
                  (item.type === "PET" && item.id === activePet) ||
                  (item.type === "AVATAR" && item.id === activeAvatar) ||
                  (item.type === "THEME" && item.id === activeTheme);

                // Component con để load Lottie riêng cho từng pet
                const PetLottie = () => {
                  const [animationData, setAnimationData] = useState<object | null>(null);
                  const [isLoading, setIsLoading] = useState(false);

                  useEffect(() => {
                    if (!isPet || !item.lottieUrl) return;

                    setIsLoading(true);
                    fetch(item.lottieUrl)
                      .then((res) => res.json())
                      .then((data) => setAnimationData(data))
                      .catch(() => setAnimationData(null))
                      .finally(() => setIsLoading(false));
                  }, [item.lottieUrl, isPet]);

                  if (isLoading) {
                    return <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400 text-sm">Đang tải...</div>;
                  }

                  if (!animationData) {
                    return <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400 text-sm">Không có animation</div>;
                  }

                  return <Lottie animationData={animationData} loop autoplay style={{ width: "80%", height: "80%" }} />;
                };

                return (
                  <div
                    key={item.id}
                    className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="relative h-40 bg-gray-900 flex items-center justify-center">
                      {isPet && item.lottieUrl ? (
                        <PetLottie />
                      ) : (
                        <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-full" />
                      )}

                      {isActive && (
                        <div className="absolute top-2 right-2 bg-green-600 px-3 py-1 rounded-full text-xs font-bold">
                          Đang dùng
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{item.description}</p>

                      <div className="mt-4 flex items-center justify-between">
                        {isActive ? (
                          <span className="text-green-400 font-medium">Đang sử dụng</span>
                        ) : (
                          <button
                            onClick={() => changeActive(item.type as TabType, item.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-full text-sm font-medium transition"
                          >
                            Sử dụng
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}