// app/profile/components/QRButtons.tsx
"use client";

import { QrCode, Camera } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

type QRButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function QRShowButton({ onClick }: QRButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden 
                 bg-gradient-to-r from-purple-600 to-pink-600 
                 hover:from-purple-500 hover:to-pink-500 
                 px-4 py-2.5 sm:px-5 sm:py-3
                 rounded-xl font-bold text-base sm:text-lg
                 flex items-center justify-center gap-2 
                 shadow-xl hover:shadow-purple-600/40 
                 transition-all duration-300 transform hover:scale-102 active:scale-95"
    >
      <QrCode className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:rotate-12" />
      <span className="hidden xs:inline">Hiện mã QR</span>
      <span className="xs:hidden">QR</span>
    </button>
  );
}

export function QRScanButton({ onClick }: QRButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden 
                 bg-gradient-to-r from-cyan-500 to-blue-600 
                 hover:from-cyan-400 hover:to-blue-500 
                 px-4 py-2.5 sm:px-5 sm:py-3
                 rounded-xl font-bold text-base sm:text-lg
                 flex items-center justify-center gap-2 
                 shadow-xl hover:shadow-cyan-600/40 
                 transition-all duration-300 transform hover:scale-102 active:scale-95"
    >
      <Camera className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
      <span className="hidden xs:inline">Quét mã</span>
      <span className="xs:hidden">Quét</span>
    </button>
  );
}
