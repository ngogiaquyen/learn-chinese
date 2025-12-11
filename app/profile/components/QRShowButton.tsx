import { QrCode } from "lucide-react";

export default function QRShowButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-8 py-4 rounded-2xl font-bold text-xl flex items-center gap-4 shadow-2xl hover:shadow-purple-600/70 transition-all transform hover:scale-105"
    >
      <QrCode className="w-8 h-8" />
      Hiện mã QR
    </button>
  );
}