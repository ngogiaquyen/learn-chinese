// components/SidebarWrapper.tsx
"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile (client-side only)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const toggle = () => setIsOpen(prev => !prev);

  return (
    <div className="flex">
      {/* Nút toggle – Responsive vị trí */}
      {!isOpen && (
        <button
          onClick={toggle}
          className={`
            fixed z-100 transition-all duration-300 active:scale-90
            ${isMobile
              ? "bottom-6 left-2   rounded-full shadow-2xl   backdrop-blur-xl border border-white/30"
              : "top-4 left-4  rounded-xl shadow-lg   backdrop-blur-md"
            }
          `}
          aria-label="Mở sidebar"
        >
          <img
            src="/images/wyn_rm.png"
            alt="logo"
            className={`object-contain ${isMobile ? "w-[42px] h-[42px]" : "w-9 h-9"}`}
          />
        </button>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isOpen} handleOpen={toggle} />

      {/* Nội dung chính – tự động dịch sang khi sidebar mở */}
      <main
        className={`
          flex-1 max-h-screen transition-all duration-300
          ${isOpen ? "lg:ml-64" : "ml-0"}
        `}
      >
        {children}
      </main>
    </div>
  );
}