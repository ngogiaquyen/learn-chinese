"use client";

import Lottie from "lottie-react";
import { motion } from "framer-motion";
import { PawPrint, Sparkles } from "lucide-react";

// Import 4 pet (đặt trong public/lottie/)
import dragon from "../../public/lottie/lego.json";
// import panda from "@/public/lottie/panda.json";
import cat from "../../public/lottie/running-cat.json";
// import fox from "@/public/lottie/fox.json";

const PETS = [
  { name: "Rồng con", animation: dragon, color: "from-red-500 to-orange-500" },
//   { name: "Panda béo", animation: panda, color: "from-green-500 to-emerald-500" },
  { name: "Mèo Thần Tài", animation: cat, color: "from-yellow-400 to-amber-500" },
//   { name: "Cáo Hồ Ly cute", animation: fox, color: "from-purple-500 to-pink-500" },
];

export default function PetGalleryPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Pet Đồng Hành Động
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Chọn một người bạn đáng yêu để đồng hành cùng bạn học tiếng Trung!
          </p>
        </motion.div>

        {/* Grid Pet */}
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {PETS.map((pet, index) => (
            <motion.div
              key={pet.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="relative bg-gray-800/70 rounded-3xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-all group shadow-2xl shadow-black/40"
            >
              {/* Gradient nền */}
              <div className={`absolute inset-0 bg-gradient-to-br ${pet.color} opacity-10`} />

              {/* Pet Lottie */}
              <div className="w-full h-64 flex items-center justify-center">
                <Lottie animationData={pet.animation} loop autoplay className="w-72 h-72" />
              </div>

              {/* Tên pet */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-2xl font-bold text-white text-center">
                  {pet.name}
                </h3>
                <p className="text-center text-gray-300 text-sm mt-1">
                  Đang nhảy nhót vui vẻ!
                </p>
              </div>

              {/* Hiệu ứng hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-indigo-600/80 px-6 py-3 rounded-full text-white font-medium">
                  Chọn làm bạn đồng hành
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chân trang */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 text-gray-500"
        >
          <p className="text-lg">
            Học càng nhiều → pet càng vui vẻ và có thể đổi skin trong shop!
          </p>
          <p className="mt-2 text-sm">
            Được tạo bằng Lottie – mượt mà, nhẹ, đẹp như game mobile.
          </p>
        </motion.div>
      </div>
    </div>
  );
}