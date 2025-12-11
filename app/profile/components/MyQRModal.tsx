import { motion } from "framer-motion";
import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: { id: number; name: string };
};

export default function MyQRModal({ isOpen, onClose, user }: Props) {
  if (!isOpen) return null;

  const qrData = JSON.stringify({ userId: user.id, name: user.name });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-3xl z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-gradient-to-br from-purple-900 via-gray-900 to-black rounded-3xl p-12 max-w-md w-full border-4 border-purple-600 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-5xl font-bold text-center mb-10 bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
          Mã QR của bạn
        </h2>
        <div className="bg-white p-10 rounded-3xl mx-auto shadow-2xl">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=340x340&data=${encodeURIComponent(qrData)}`}
            alt="QR Code"
            className="w-full"
          />
        </div>
        <p className="text-center text-4xl font-bold text-yellow-400 mt-8">{user.name}</p>
        <p className="text-center text-gray-400 text-xl">ID: {user.id}</p>
        <button
          onClick={onClose}
          className="mt-10 w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 py-6 rounded-2xl font-bold text-2xl flex items-center justify-center gap-4"
        >
          <X className="w-8 h-8" /> Đóng
        </button>
      </motion.div>
    </motion.div>
  );
}