// app/auth/signup/page.tsx
'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username: username.trim() || null }),
      });

      if (res.ok) {
        alert("Đăng ký thành công! Đang chuyển đến trang đăng nhập...");
        router.push("/auth/signin");
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Email đã tồn tại hoặc có lỗi xảy ra!");
      }
    } catch (error) {
      alert("Lỗi kết nối, vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-96 border border-gray-700"
      >
        <h2 className="text-4xl font-bold text-yellow-300 mb-8 text-center">
          Đăng Ký
        </h2>

        <input
          type="text"
          placeholder="Tên hiển thị (tùy chọn)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          className="w-full p-4 mb-4 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className="w-full p-4 mb-4 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          disabled={isLoading}
          className="w-full p-4 mb-6 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full relative font-bold py-4 rounded-lg text-lg text-white transition-all duration-300 transform
            ${isLoading
              ? 'bg-blue-700 cursor-not-allowed opacity-90'
              : 'bg-blue-600 hover:bg-blue-500 hover:scale-105 hover:shadow-xl active:scale-100'
            }
          `}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin inline w-5 h-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang tạo tài khoản...
            </>
          ) : (
            "Đăng Ký Ngay"
          )}
        </button>

        <p className="text-center mt-6 text-gray-400">
          Đã có tài khoản?{" "}
          <a
            href="/auth/signin"
            className="text-yellow-400 hover:underline font-bold"
          >
            Đăng nhập
          </a>
        </p>
      </form>
    </div>
  );
}