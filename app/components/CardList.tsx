"use client";

import { useMemo, useState, useEffect } from "react";
import { Card } from "../types/card";
import FlashCard from "./FlashCard";
import SkeletonCard from "./SkeletonCard";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const STORAGE_KEY = "hsk-levels-open-state";

// Hàm lấy trạng thái mở từ localStorage (chỉ chạy 1 lần khi khởi tạo state)
const loadOpenLevels = (availableLevels: number[]): Set<number> => {
  if (typeof window === "undefined") return new Set();

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const validLevels = parsed.filter(
          (n): n is number => typeof n === "number"
        );
        // Chỉ giữ lại những level thực sự tồn tại
        return new Set(validLevels.filter((l) => availableLevels.includes(l)));
      }
    }
  } catch (e) {
    console.warn("Không thể đọc trạng thái mở HSK từ localStorage", e);
  }

  // Mặc định: mở hết tất cả level lần đầu sử dụng
  return new Set(availableLevels);
};

export default function CardList({ cards }: { cards: Card[] }) {
  const { grouped, levels, isLoading, isEmpty } = useMemo(() => {
    if (cards.length === 0) {
      return { grouped: {}, levels: [], isLoading: true, isEmpty: false };
    }

    const grouped = cards.reduce((acc, card) => {
      const level = card.hskLevel ?? 1;
      (acc[level] ??= []).push(card);
      return acc;
    }, {} as Record<number, Card[]>);

    const levels = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b);

    return {
      grouped,
      levels,
      isLoading: false,
      isEmpty: levels.length === 0,
    };
  }, [cards]);

  // Khởi tạo đúng 1 lần, đúng cách React 19 khuyến nghị
  const [openLevels, setOpenLevels] = useState<Set<number>>(new Set());

  useEffect(() => {
    setOpenLevels(loadOpenLevels(levels));
  }, [levels]);

  const [isMounted, setIsMounted] = useState(false);

  // Đánh dấu đã mount + lưu lần đầu nếu cần
  useEffect(() => {
    setIsMounted(true);

    // Nếu lần đầu mở hết → lưu luôn để lần sau vẫn mở
    if (openLevels.size === levels.length && levels.length > 0) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(Array.from(openLevels))
        );
      } catch {}
    }
  }, [levels, openLevels.size]);

  // Lưu mỗi khi người dùng thay đổi
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(openLevels)));
    } catch (e) {
      console.warn("Không thể lưu trạng thái HSK levels", e);
    }
  }, [openLevels, isMounted]);

  const toggleLevel = (level: number) => {
    setOpenLevels((prev) => {
      const next = new Set(prev);
      next.has(level) ? next.delete(level) : next.add(level);
      return next;
    });
  };

  const toggleAll = () => {
    setOpenLevels(
      openLevels.size === levels.length ? new Set() : new Set(levels)
    );
  };

  const allOpen = openLevels.size === levels.length;

  // Trường hợp trống
  if (!isLoading && isEmpty) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-6xl mb-6 text-gray-700">Empty</div>
          <p className="text-2xl text-gray-400 mb-2">Chưa có từ vựng nào</p>
          <p className="text-lg text-gray-500">
            Hãy thêm từ HSK 1-6 để bắt đầu học nhé!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Nút Mở/Đóng tất cả */}
        {!isLoading && levels.length > 1 && (
          <div className="mb-8 text-right">
            <button
              onClick={toggleAll}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-900/20 text-indigo-400 hover:bg-indigo-900/40 transition-colors"
            >
              {allOpen ? (
                <>
                  <ChevronUp className="w-4 h-4" /> Đóng tất cả
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" /> Mở tất cả
                </>
              )}
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading ? (
          <div className="grid gap-8 justify-center sm:justify-start grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            <AnimatePresence mode="popLayout">
              {Array.from({ length: 18 }, (_, i) => (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex justify-center"
                >
                  <SkeletonCard />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* Danh sách các level */
          <>
            {levels.map((level) => {
              const cardsInLevel = grouped[level];
              const isOpen = openLevels.has(level);

              return (
                <section key={level} className="mb-12 last:mb-0">
                  {/* Header level */}
                  <button
                    onClick={() => toggleLevel(level)}
                    className="w-full flex items-center justify-between py-3 px-3 rounded-lg hover:bg-indigo-900/20 transition-colors group"
                  >
                    <h2 className="text-lg font-bold text-indigo-400 border-l-4 border-indigo-500 pl-3">
                      HSK {level}{" "}
                      <span className="font-normal text-gray-500 ml-2">
                        ({cardsInLevel.length} từ)
                      </span>
                    </h2>

                    <div className="flex items-center gap-2 text-indigo-400">
                      <span className="text-sm opacity-70 group-hover:opacity-100">
                        {isOpen ? "Ẩn" : "Hiện"}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </button>

                  {/* Danh sách thẻ */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6 grid gap-8 justify-center sm:justify-start grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                          <AnimatePresence mode="popLayout">
                            {cardsInLevel.map((card, idx) => (
                              <motion.div
                                key={card.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{
                                  delay: idx * 0.03,
                                  ease: "easeOut",
                                }}
                                className="flex justify-center"
                              >
                                <FlashCard
                                  id={card.id}
                                  chinese={card.chinese}
                                  pinyin={card.pinyin}
                                  meaning={card.meaning}
                                  status={card.status}
                                />
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
