// app/profile/components/ScanQRModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import QrScanner from "qr-scanner";
import { X, Send, CheckCircle, Loader2 } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCoinsUpdate?: () => void; // Callback để update xu ở trang cha
};

export default function ScanQRModal({ isOpen, onClose, onCoinsUpdate }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [scannedUser, setScannedUser] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);

  // Reset toàn bộ khi đóng modal
  useEffect(() => {
    if (!isOpen) {
      scannerRef.current?.stop();
      scannerRef.current?.destroy();
      scannerRef.current = null;

      setScannedUser(null);
      setAmount("");
      setError(null);
      setIsTransferring(false);
      setTransferSuccess(false);

      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isOpen]);

  // Khởi động camera và quét QR (chỉ khi chưa quét được)
  useEffect(() => {
    if (!isOpen || scannedUser) return;

    const video = videoRef.current;
    if (!video) return;

    const scanner = new QrScanner(
      video,
      (result) => {
        try {
          const data = JSON.parse(result.data);
          if (data.userId && data.name) {
            setScannedUser({ id: data.userId, name: data.name });
            scanner.stop();

            // Âm thanh "ting" khi quét thành công
            new Audio(
              "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVeaT4a"
            )
              .play()
              .catch(() => {});
          }
        } catch (err) {
          console.log("QR không hợp lệ");
        }
      },
      {
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        returnDetailedScanResult: true,
      }
    );

    scannerRef.current = scanner;
    scanner.start().catch((err) => {
      setError("Không thể mở camera. Vui lòng cho phép truy cập camera.");
      console.error(err);
    });

    return () => {
      if (!scannedUser) {
        scanner.stop();
        scanner.destroy();
      }
    };
  }, [isOpen, scannedUser]);

  const handleTransfer = async () => {
    if (!scannedUser || !amount || Number(amount) <= 0 || isTransferring)
      return;

    setIsTransferring(true);
    setError(null);

    try {
      const res = await fetch("/api/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "transfer",
          toUserId: scannedUser.id,
          amount: Number(amount),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setTransferSuccess(true);

        onCoinsUpdate?.();

        // Tự động đóng modal sau 2 giây với hiệu ứng đẹp
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(data.error || "Chuyển xu thất bại!");
        setIsTransferring(false);
      }
    } catch (err) {
      setError("Lỗi mạng, vui lòng thử lại.");
      setIsTransferring(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-3xl z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-gradient-to-br from-cyan-900/90 via-gray-900 to-black rounded-3xl p-8 max-w-lg w-full border-4 border-cyan-500 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng góc */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition"
        >
          <X className="w-8 h-8 text-cyan-300" />
        </button>

        <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Quét mã chuyển xu
        </h2>

        {/* Giai đoạn 1: Đang quét */}
        {!scannedUser ? (
          <div className="space-y-8 text-center">
            <div className="relative mx-auto w-full max-w-[380px] aspect-square">
              <video
                ref={videoRef}
                className="w-full h-full rounded-3xl border-8 border-cyan-400 shadow-2xl object-cover"
                playsInline
                muted
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-3/4 h-3/4 border-4 border-white/70 rounded-2xl animate-pulse" />
              </div>
            </div>

            {error ? (
              <p className="text-xl text-red-400">{error}</p>
            ) : (
              <p className="text-xl sm:text-2xl font-bold text-cyan-300 animate-pulse">
                Đưa mã QR vào khung
              </p>
            )}
          </div>
        ) : (
          /* Giai đoạn 2: Đã quét, nhập số xu */
          <div className="space-y-8 text-center">
            {transferSuccess ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-6"
              >
                <CheckCircle className="w-32 h-32 text-green-500 mx-auto animate-bounce" />
                <p className="text-4xl sm:text-5xl font-bold text-green-400">
                  Chuyển thành công!
                </p>
                <p className="text-xl text-gray-300">
                  +{Number(amount).toLocaleString()} xu đã gửi đến
                </p>
                <p className="text-3xl font-bold text-yellow-400">
                  {scannedUser.name}
                </p>
                <p className="text-sm text-gray-500">Đóng sau vài giây...</p>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <CheckCircle className="w-24 h-24 text-green-500 mx-auto animate-bounce" />
                  <p className="text-4xl sm:text-5xl font-bold text-yellow-400 mt-4">
                    {scannedUser.name}
                  </p>
                  <p className="text-lg text-gray-400">ID: {scannedUser.id}</p>
                </motion.div>

                <input
                  type="tel"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                  placeholder="Nhập số xu"
                  className="w-full px-8 py-7 text-4xl font-bold text-center bg-gray-800/90 rounded-3xl border-2 border-cyan-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/50 outline-none transition"
                  autoFocus
                />

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xl text-red-400"
                  >
                    {error}
                  </motion.p>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={onClose}
                    disabled={isTransferring}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 
               py-3 sm:py-4 min-h-[52px] rounded-xl font-bold 
               text-sm sm:text-lg transition"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleTransfer}
                    disabled={!amount || Number(amount) <= 0 || isTransferring}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 
               hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 
               py-3 sm:py-4 min-h-[52px] rounded-xl font-bold 
               text-sm sm:text-lg flex items-center justify-center gap-2 sm:gap-3 
               transition transform hover:scale-105 disabled:hover:scale-100"
                  >
                    {isTransferring ? (
                      <>
                        <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                        <span>Đang chuyển...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span>Chuyển ngay</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {!transferSuccess && (
          <button
            onClick={onClose}
            className="mt-10 w-full bg-gradient-to-r from-red-600 to-pink-600 
               hover:from-red-500 hover:to-pink-500 
               py-3 sm:py-4 min-h-[52px] rounded-2xl font-bold 
               text-sm sm:text-lg flex items-center justify-center gap-2 sm:gap-3 
               transition transform hover:scale-105"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>Đóng</span>
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
