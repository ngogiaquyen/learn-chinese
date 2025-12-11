// components/shared/ShopTabs.tsx
"use client";

import { motion } from "framer-motion";
import { PawPrint, Palette, UserCircle, Shirt, Music } from "lucide-react";

type TabType = "PET" | "AVATAR" | "THEME" | "SKIN" | "MUSIC";

const TABS = [
  { id: "PET" as const,     label: "Pet",     icon: PawPrint },
  { id: "AVATAR" as const,  label: "Avatar",  icon: UserCircle },
  { id: "THEME" as const,   label: "Chủ đề",  icon: Palette },
  { id: "SKIN" as const,    label: "Skin",    icon: Shirt },
  { id: "MUSIC" as const,   label: "Nhạc",    icon: Music },
] as const;

type Props = {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
};

export default function ShopTabs({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-10 mt-6">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative flex items-center gap-2.5
              px-5 py-2.5 sm:px-6 sm:py-3
              rounded-xl font-semibold text-sm sm:text-base
              transition-all duration-300
              ${isActive
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/40"
                : "bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-700/70 hover:border-purple-500/40"
              }
            `}
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-yellow-300" : "text-gray-400"}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}