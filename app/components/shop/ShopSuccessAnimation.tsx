import { motion, AnimatePresence } from "framer-motion";

export default function ShopSuccessAnimation({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="text-6xl font-bold text-yellow-400 drop-shadow-2xl"
          >
            Mua thành công!
            <motion.div
              animate={{ y: [-20, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: 3 }}
              className="text-4xl mt-4"
            >
              💥✨💰
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}