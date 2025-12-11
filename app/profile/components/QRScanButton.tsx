import { Camera } from "lucide-react";

export default function QRScanButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-8 py-4 rounded-2xl font-bold text-xl flex items-center gap-4 shadow-2xl hover:shadow-cyan-600/70 transition-all transform hover:scale-105"
    >
      <Camera className="w-8 h-8" />
      Quét mã
    </button>
  );
}