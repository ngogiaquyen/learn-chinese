import { motion } from "framer-motion";
import { PawPrint, Palette, UserCircle, Shirt, Music } from "lucide-react";

type TabType = "PET" | "THEME" | "AVATAR" | "SKIN" | "MUSIC";

// Trong ShopTabs, sửa lại thành uppercase
const TABS = [
  { id: "PET" as const, label: "Pet", icon: PawPrint },
  { id: "THEME" as const, label: "Theme", icon: Palette },
  { id: "AVATAR" as const, label: "Avatar", icon: UserCircle },
  { id: "SKIN" as const, label: "Skin", icon: Shirt },
  { id: "MUSIC" as const, label: "Nhạc nền", icon: Music },
] as const;

export default function ShopTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}) {
  return (
    <div className="relative mb-10">
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="relative px-6 py-3 text-sm font-medium transition-colors group"
          >
            <div className="flex items-center gap-2">
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </div>

            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}