// app/profile/components/ScanQRModal.tsx
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import QrScanner from "qr-scanner";
import { X, Send, CheckCircle, RefreshCw } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ScanQRModal({ isOpen, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const [scannedUser, setScannedUser] = useState<{ id: number; name: string } | null>(null);
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "scanning" | "denied" | "error">("idle");

  useEffect(() => {
    if (!isOpen || scannedUser || !videoRef.current) return;

    setStatus("loading");

    const startScanner = async (facingMode: "environment" | "user") => {
      try {
        // Cách đúng 100% với TypeScript + fallback tốt nhất
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (!videoRef.current) return;

        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        const qrScanner = new QrScanner(
          videoRef.current,
          (result) => {
            try {
              const data = JSON.parse(result.data);
              if (data.userId && data.name) {
                setScannedUser({ id: data.userId, name: data.name });
                qrScanner.stop();
                setStatus("scanning");
              }
            } catch (e) {
              console.log("QR không hợp lệ:", result.data);
            }
          },
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
            maxScansPerSecond: 15,
          }
        );

        await qrScanner.start();
        qrScannerRef.current = qrScanner;
        setStatus("scanning");
      } catch (err: any) {
        console.error(`Camera ${facingMode} thất bại:`, err);
        throw err;
      }
    };

    // Ưu tiên camera sau → nếu lỗi thì thử camera trước
    startScanner("environment").catch(() => {
      startScanner("user").catch(() => {
        setStatus("denied");
      });
    });

    // Cleanup khi thoát
    return () => {
      qrScannerRef.current?.stop();
      qrScannerRef.current?.destroy();
      qrScannerRef.current = null;

      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [isOpen, scannedUser]);

  // Reset khi đóng modal
  useEffect(() => {
    if (!isOpen) {
      qrScannerRef.current?.stop();
      qrScannerRef.current?.destroy();
      qrScannerRef.current = null;

      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }

      setScannedUser(null);
      setAmount("");
      setStatus("idle");
    }
  }, [isOpen]);

  const retry = () => {
    setScannedUser(null);
    setStatus("idle");
  };

  const handleTransfer = async () => {
    if (!scannedUser || !amount || Number(amount) <= 0) return;

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

      if (res.ok) {
        alert(`Đã chuyển ${Number(amount).toLocaleString()} xu cho ${scannedUser.name}!`);
        onClose();
        window.location.reload();
      } else {
        alert("Chuyển thất bại! Vui lòng thử lại.");
      }
    } catch {
      alert("Lỗi kết nối mạng");
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
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-gradient-to-br from-cyan-900/90 via-gray-900 to-black rounded-3xl p-8 max-w-lg w-full border-4 border-cyan-500 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng góc */}
        <button onClick={onClose} className="absolute top-4 right-4 text-cyan-300 hover:text-white z-10">
          <X className="w-10 h-10" />
        </button>

        <h2 className="text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Quét mã chuyển xu
        </h2>

        {/* Trạng thái chưa quét được */}
        {!scannedUser ? (
          <div className="space-y-8 text-center">
            <video
              ref={videoRef}
              className="mx-auto rounded-3xl border-8 border-cyan-400 shadow-2xl w-full max-w-md aspect-square object-cover"
              playsInline
              muted
            />

            {/* Thông báo trạng thái */}
            {status === "loading" && (
              <p className="text-2xl font-bold text-cyan-300 animate-pulse">Đang mở camera...</p>
            )}

            {status === "scanning" && (
              <p className="text-2xl font-bold text-cyan-300 animate-pulse">Đang quét mã QR...</p>
            )}

            {(status === "denied" || status === "error") && (
              <div className="space-y-4">
                <p className="text-2xl font-bold text-red-400">
                  {status === "denied" ? "Không có quyền truy cập camera" : "Không mở được camera"}
                </p>
                <p className="text-gray-300">
                  Vào Cài đặt {"→"} Quyền riêng tư {"→"} Camera {"→"} Cho phép trình duyệt
                </p>
                <button
                  onClick={retry}
                  className="mx-auto flex items-center gap-3 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white font-bold text-xl transition"
                >
                  <RefreshCw className="w-6 h-6" />
                  Thử lại
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Sau khi quét thành công */
          <div className="space-y-8 text-center">
            <CheckCircle className="w-28 h-28 text-green-500 mx-auto animate-bounce" />
            <p className="text-5xl font-bold text-yellow-400 break-all">{scannedUser.name}</p>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
              placeholder="Nhập số xu"
              className="w-full px-8 py-7 text-4xl font-bold text-center bg-gray-800/90 rounded-3xl border-2 border-cyan-600 focus:ring-4 focus:ring-cyan-500 outline-none text-white placeholder-gray-500"
              autoFocus
            />

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-5 rounded-xl font-bold text-xl transition"
              >
                Hủy
              </button>
              <button
                onClick={handleTransfer}
                disabled={!amount || Number(amount) <= 0}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed py-5 rounded-xl font-bold text-xl flex items-center justify-center gap-3 transition"
              >
                <Send className="w-7 h-7" />
                Chuyển ngay
              </button>
            </div>
          </div>
        )}

        {/* Nút đóng dưới cùng */}
        <button
          onClick={onClose}
          className="mt-10 w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition"
        >
          <X className="w-8 h-8" />
          Đóng
        </button>
      </motion.div>
    </motion.div>
  );
}