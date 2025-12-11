import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export function ShopConfirmModal({
  show,
  onClose,
  onConfirm,
  itemName,
  price,
  processing,
}: {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  price: number;
  processing?: boolean;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 border border-indigo-500/50"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Xác nhận mua</h3>
            <p className="text-gray-300 mb-6">
              Bạn muốn mua{" "}
              <span className="text-indigo-400 font-bold">{itemName}</span> với{" "}
              <span className="text-yellow-400 font-bold">{price} xu</span>?
            </p>
            <div className="flex gap-4">
              <button
                onClick={onClose}
                disabled={processing}
                className="flex-1 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={onConfirm}
                disabled={processing}
                className="flex-1 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition font-bold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Đang xử lý...
                  </>
                ) : (
                  "Mua ngay"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}