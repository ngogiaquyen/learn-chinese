"use client";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Sidebar({ isOpen, handleOpen }: { isOpen: boolean, handleOpen: () => void }) {
  const { data: session, status } = useSession();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col p-6 border-r border-dashed border-yellow-300 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Khi mở thì hiện title + logo */}
      {isOpen && (
        <div className="flex justify-between items-center gap-3 mb-10">
          <h1 className="text-2xl font-bold text-yellow-300">Flashcard App</h1>
          <Image
          onClick={handleOpen}
            className="w-10 h-10 object-contain"
            src="/images/wyn_rm.png"
            alt="logo"
          />
        </div>
      )}

      <nav className="flex flex-col gap-4 text-lg">
        <Link href="/" className="hover:text-yellow-400">Home</Link>
        <Link href="/chua-hoc" className="hover:text-yellow-400">chưa học</Link>
        <Link href="/dang-hoc" className="hover:text-yellow-400">đang học</Link>
        <Link href="/can-on-lai" className="hover:text-yellow-400">cần ôn lại</Link>
        <Link href="/da-thuoc-long" className="hover:text-yellow-400">đã thuộc lòng</Link>
      </nav>

      <div className="mt-auto">
        {status === "authenticated" ? (
          <div>
            <p className="text-sm text-gray-400 mb-2">Xin chào, {session.user?.name}</p>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-red-400 hover:text-red-300"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <a href="/auth/signin" className="text-green-400 hover:text-green-300">Đăng nhập</a>
        )}
      </div>
    </aside>
  );
}
