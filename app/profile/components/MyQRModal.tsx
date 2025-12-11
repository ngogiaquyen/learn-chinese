"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: { id: number; name: string };
};

export default function MyQRModal({ isOpen, onClose, user }: Props) {
  const [receivedAmount, setReceivedAmount] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);

  const qrData = JSON.stringify({ userId: user.id, name: user.name });
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
    qrData
  )}`;

  useEffect(() => {
    if (!isOpen) {
      setShowSuccess(false);
      setReceivedAmount(null);
      setQrLoaded(false);
    }
  }, [isOpen]);

  const handleReceiveCoins = (amount: number) => {
    setReceivedAmount(amount);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setReceivedAmount(null);
      onClose();
    }, 6000);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative bg-gradient-to-br from-purple-900/90 via-gray-900 to-black/90 
                   rounded-3xl p-6 sm:p-8 md:p-10 
                   max-h-[90vh] w-auto
                   border border-purple-500/50 shadow-2xl overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng góc */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md 
                     flex items-center justify-center hover:bg-white/20 transition"
        >
          <X className="w-6 h-6 text-gray-300" />
        </button>

        <div className="text-center space-y-6 sm:space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Mã QR của bạn
          </h2>

          {showSuccess && receivedAmount ? (
            <div className="space-y-6">
              <CheckCircle className="w-24 h-24 sm:w-32 sm:h-32 mx-auto text-green-400 animate-bounce" />
              <div>
                <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-400">
                  +{receivedAmount.toLocaleString()} xu
                </p>
                <p className="text-lg sm:text-xl text-gray-300 mt-3">
                  Đã nhận thành công!
                </p>
              </div>
              <p className="text-sm text-gray-500">Tự động đóng sau 6 giây...</p>
            </div>
          ) : (
            <>
              {/* QR Code với Lazy Loading + Skeleton */}
              <div className="mx-auto w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px]">
                <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-2xl relative overflow-hidden">
                  {!qrLoaded && (
                    <div className="w-full aspect-square rounded-2xl bg-gray-200 animate-pulse relative overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>
                  )}

                  <img
                    src={qrUrl}
                    alt="QR Code của bạn"
                    className={`w-full h-auto rounded-2xl transition-opacity duration-500 ${
                      qrLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => setQrLoaded(true)}
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Tên & ID */}
              <div className=" space-y-3">
                <p className="text-lg sm:text-xl text-gray-400">
                  ID: <span className="text-purple-300">{user.id}</span>
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300 truncate max-w-full px-4">
                  {user.name}
                </p>
              </div>
            </>
          )}

        </div>
      </motion.div>
    </motion.div>
  );
}
