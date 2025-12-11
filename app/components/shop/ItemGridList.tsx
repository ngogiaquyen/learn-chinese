// components/shared/ItemGridList.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

type Props<T> = {
  items: T[];
  renderItem: (item: T) => ReactNode;
  emptyMessage?: string;
  columns?: {
    base?: number;
    sm?: number;
    lg?: number;
    xl?: number;
  };
};

export default function ItemGridList<T>({
  items,
  renderItem,
  emptyMessage = "Chưa có vật phẩm nào",
  columns = { base: 1, sm: 2, lg: 3, xl: 4 },
}: Props<T>) {
  const gridCols = `
    grid-cols-${columns.base}
    sm:grid-cols-${columns.sm || columns.base}
    lg:grid-cols-${columns.lg || columns.sm || columns.base}
    xl:grid-cols-${columns.xl || columns.lg || columns.sm || columns.base}
  `;

  if (items.length === 0) {
    return (
      <div className="col-span-full text-center py-20">
        <p className="text-2xl text-gray-500 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className={`grid gap-8 ${gridCols} mt-12`}
    >
      <AnimatePresence mode="popLayout">
        {items.map((item: any) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -40 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 28,
            }}
            whileHover={{ y: -14, scale: 1.03 }}
            className="group"
          >
            {renderItem(item)}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}