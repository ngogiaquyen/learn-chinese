"use client";

import { useMemo, useState, useEffect, useRef, useEffectEvent } from "react";
import { Card } from "../types/card";
import FlashCard from "./FlashCard";
import { motion, AnimatePresence } from "framer-motion";
import SkeletonCard from "./SkeletonCard";
import { ChevronDown, ChevronUp } from "lucide-react";

const STORAGE_KEY = "hsk-levels-open-state";

export default function CardList({ cards }: { cards: Card[] }) {
  const [openLevels, setOpenLevels] = useState<Set<number>>(new Set());
  const [isMounted, setIsMounted] = useState(false);
  const hasInitialized = useRef(false); // ← Quan trọng: tránh gọi setState đồng bộ trong effect

  const { grouped, levels, isLoading, isEmpty } = useMemo(() => {
    if (cards.length === 0) {
      return {
        grouped: {} as Record<number, Card[]>,
        levels: [] as number[],
        isLoading: true,
        isEmpty: false,
      };
    }

    const grouped = cards.reduce((acc, card) => {
      const level = card.hskLevel ?? 1;
      if (!acc[level]) acc[level] = [];
      acc[level].push(card);
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

  const start = useEffectEvent(() => {
    setIsMounted(true);

    // Nếu đã khởi tạo rồi thì không làm gì nữa
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    let savedLevels: number[] = [];

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          savedLevels = parsed.filter(
            (n): n is number => typeof n === "number"
          );
        }
      }
    } catch (e) {
      console.warn("Lỗi đọc localStorage", e);
    }

    // Nếu có dữ liệu đã lưu → ưu tiên dùng nó
    if (savedLevels.length > 0) {
      setOpenLevels(new Set(savedLevels));
      return;
    }

    // Nếu chưa có gì → mở hết lần đầu và lưu luôn
    if (levels.length > 0) {
      const defaultOpen = new Set(levels);
      setOpenLevels(defaultOpen);
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(Array.from(defaultOpen))
        );
      } catch {}
    }
  });

  // === CHỈ CHẠY 1 LẦN SAU KHI MOUNT (client-side) ===
  useEffect(() => {
    start();
  }, [levels]); // chỉ chạy lại khi levels thay đổi (ví dụ: thêm level mới)

  // === Lưu vào localStorage khi người dùng thay đổi ===
  useEffect(() => {
    if (!isMounted || !hasInitialized.current) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(openLevels)));
    } catch (e) {
      console.warn("Không thể lưu trạng thái HSK levels", e);
    }
  }, [openLevels, isMounted]);

  const toggleLevel = (level: number) => {
    setOpenLevels((prev) => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  };

  const toggleAll = () => {
    setOpenLevels(
      openLevels.size === levels.length ? new Set() : new Set(levels)
    );
  };

  if (!isLoading && isEmpty) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
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
    <div className="w-full px-4 py-8 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Nút Mở/Đóng tất cả */}
        {!isLoading && levels.length > 1 && (
          <div className="mb-8 text-right">
            <button
              onClick={toggleAll}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-400 bg-indigo-900/30 rounded-lg hover:bg-indigo-900/50 transition-colors"
            >
              {isMounted && openLevels.size === levels.length ? (
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

        {isLoading ? (
          /* LOADING */
          <div className="grid justify-center sm:justify-start gap-8 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            <AnimatePresence mode="popLayout">
              {Array.from({ length: 12 }, (_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex justify-center"
                >
                  <SkeletonCard />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* NỘI DUNG CHÍNH */
          <>
            {levels.map((level) => {
              const levelCards = grouped[level];
              const isOpen = openLevels.has(level);

              return (
                <section key={level} className="mb-12 last:mb-8">
                  <button
                    onClick={() => toggleLevel(level)}
                    className="w-full text-left group flex items-center justify-between hover:bg-indigo-900/20 rounded-lg px-2 py-3 transition-colors"
                  >
                    <h2 className="text-lg font-bold text-indigo-400 pl-1 border-l-4 border-indigo-500">
                      HSK {level}{" "}
                      <span className="text-gray-500 font-normal ml-2">
                        • {levelCards.length} từ
                      </span>
                    </h2>

                    <div className="flex items-center gap-2 pr-2 text-indigo-400">
                      {isMounted ? (
                        <>
                          <span className="text-sm opacity-70 group-hover:opacity-100 transition-opacity">
                            {isOpen ? "Ẩn" : "Hiện"}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </>
                      ) : (
                        <>
                          <span className="text-sm opacity-70">Hiện</span>
                          <ChevronDown className="w-5 h-5" />
                        </>
                      )}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="grid justify-center sm:justify-start gap-8 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 mt-6">
                          <AnimatePresence mode="popLayout">
                            {levelCards.map((card, index) => (
                              <motion.div
                                key={card.id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{
                                  duration: 0.5,
                                  delay: index * 0.03,
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
