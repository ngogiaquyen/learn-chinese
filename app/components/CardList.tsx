'use client';

import { useMemo } from 'react';
import { Card } from '../types/card';
import FlashCard from './FlashCard';
import { motion, AnimatePresence } from 'framer-motion';
import SkeletonCard from './SkeletonCard';

export default function CardList({ cards }: { cards: Card[] }) {
  const { grouped, levels, isLoading, isEmpty } = useMemo(() => {
    // 1. Đang loading: chưa có data (có thể thay bằng prop loading thật nếu cần)
    if (cards.length === 0) {
      return {
        grouped: {} as Record<number, Card[]>,
        levels: [] as number[],
        isLoading: true,
        isEmpty: false,
      };
    }

    // 2. Có dữ liệu → nhóm theo HSK level
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
      isEmpty: levels.length === 0, // dù cards.length > 0 nhưng có thể tất cả level = null?
    };
  }, [cards]);

  // Trường hợp trống hoàn toàn (không loading, không có card)
  if (!isLoading && isEmpty) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="text-6xl mb-6 text-gray-700">Empty</div>
          <p className="text-2xl text-gray-400 mb-2">Chưa có từ vựng nào</p>
          <p className="text-lg text-gray-500">Hãy thêm từ HSK 1-6 để bắt đầu học nhé!</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          // === TRẠNG THÁI LOADING: 12 skeleton ===
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
          // === TRẠNG THÁI CÓ DỮ LIỆU: nhóm theo level ===
          <>
            {levels.map((level) => {
              const levelCards = grouped[level];
              return (
                <section key={level} className="mb-16 last:mb-8">
                  <h2 className="text-lg font-bold text-indigo-400 mb-8 pl-1 border-l-4 border-indigo-500">
                    HSK {level}{' '}
                    <span className="text-gray-500 font-normal ml-2">
                      • {levelCards.length} từ
                    </span>
                  </h2>

                  <div className="grid justify-center sm:justify-start gap-8 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
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
                </section>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}