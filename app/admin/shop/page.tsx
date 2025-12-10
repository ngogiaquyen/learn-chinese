"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, ChevronLeft } from "lucide-react";
import Lottie from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";

type ShopItem = {
  id: number;
  name: string;
  price: number;
  type: "PET" | "THEME" | "AVATAR" | "SKIN" | "MUSIC";
  image?: string;
  lottieUrl?: string;
  description?: string;
};

function PetAnimation({ lottieUrl }: { lottieUrl?: string }) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    if (!lottieUrl) return;
    fetch(lottieUrl)
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(() => setAnimationData(null));
  }, [lottieUrl]);

  if (!animationData) return <div className="text-gray-500 text-sm">No animation</div>;

  return <Lottie animationData={animationData} loop autoplay className="w-full h-full" />;
}

export default function AdminShopPage() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
  const [formData, setFormData] = useState<Partial<ShopItem>>({});
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/shop")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => alert("Không tải được sản phẩm"));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) || 0 : value,
    }));
  };

  const openForm = (item?: ShopItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ type: "PET" });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.type) return alert("Vui lòng điền đầy đủ");

    setActionLoading(true);
    const method = editingItem ? "PUT" : "POST";
    const url = editingItem ? `/api/admin/shop/${editingItem.id}` : "/api/admin/shop";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      const newItem = await res.json();

      if (editingItem) {
        setItems((prev) => prev.map((i) => (i.id === newItem.id ? newItem : i)));
      } else {
        setItems((prev) => [...prev, newItem]);
      }

      closeForm();
    } catch {
      alert("Lỗi khi lưu sản phẩm");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xóa sản phẩm này?")) return;

    try {
      const res = await fetch(`/api/admin/shop/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      alert("Không thể xóa");
    }
  };

  if (loading) return <div className="text-center py-20 text-2xl">Đang tải...</div>;

  return (
    <>
      <div className="min-h-screen bg-gray-950 text-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Quản lý Shop
          </h1>

          {/* Danh sách sản phẩm */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl overflow-hidden shadow-2xl hover:shadow-yellow-500/10 transition-shadow"
              >
                {item.type === "PET" && item.lottieUrl ? (
                  <div className="h-64 bg-gray-900/80 flex items-center justify-center p-6">
                    <PetAnimation lottieUrl={item.lottieUrl} />
                  </div>
                ) : (
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="w-full h-64 object-cover"
                  />
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold text-yellow-300">{item.name}</h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{item.description || "Không có mô tả"}</p>
                  <p className="text-2xl font-bold text-yellow-400 mt-4">{item.price.toLocaleString()} xu</p>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => openForm(item)}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl flex items-center justify-center gap-2 transition"
                    >
                      <Edit className="w-4 h-4" /> Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 bg-red-600 hover:bg-red-500 py-3 rounded-xl flex items-center justify-center gap-2 transition"
                    >
                      <Trash2 className="w-4 h-4" /> Xóa
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-20 text-gray-500 text-xl">
              Chưa có sản phẩm nào. Bấm nút "+" để thêm nhé!
            </div>
          )}
        </div>
      </div>

      {/* Nút mở form cố định góc phải dưới */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => openForm()}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-5 rounded-full shadow-2xl shadow-purple-500/50"
      >
        <Plus className="w-8 h-8" />
      </motion.button>

      {/* Form trượt từ bên phải */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full max-w-xl bg-gray-900/95 backdrop-blur-xl shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-yellow-400">
                  {editingItem ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
                </h2>
                <button
                  onClick={closeForm}
                  className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  name="name"
                  placeholder="Tên sản phẩm"
                  value={formData.name || ""}
                  onChange={handleChange}
                  required
                  className="w-full p-4 bg-gray-800 rounded-xl focus:ring-4 focus:ring-yellow-500 focus:outline-none"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="price"
                    type="number"
                    placeholder="Giá (xu)"
                    value={formData.price || ""}
                    onChange={handleChange}
                    required
                    className="p-4 bg-gray-800 rounded-xl focus:ring-4 focus:ring-yellow-500 focus:outline-none"
                  />
                  <select
                    name="type"
                    value={formData.type || ""}
                    onChange={handleChange}
                    required
                    className="p-4 bg-gray-800 rounded-xl focus:ring-4 focus:ring-yellow-500 focus:outline-none"
                  >
                    <option value="">Chọn loại</option>
                    <option value="PET">Pet</option>
                    <option value="THEME">Theme</option>
                    <option value="AVATAR">Avatar</option>
                    <option value="SKIN">Skin</option>
                    <option value="MUSIC">Nhạc</option>
                  </select>
                </div>

                <input
                  name="image"
                  placeholder="URL ảnh preview"
                  value={formData.image || ""}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-800 rounded-xl"
                />

                <input
                  name="lottieUrl"
                  placeholder="URL Lottie (chỉ cho PET)"
                  value={formData.lottieUrl || ""}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-800 rounded-xl"
                />

                <textarea
                  name="description"
                  placeholder="Mô tả sản phẩm"
                  value={formData.description || ""}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-4 bg-gray-800 rounded-xl resize-none"
                />

                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition disabled:opacity-50"
                  >
                    {actionLoading ? "Đang lưu..." : editingItem ? "Cập nhật" : "Thêm mới"}
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-8 py-4 bg-gray-700 rounded-xl hover:bg-gray-600 transition"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay khi form mở */}
      {isFormOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeForm}
          className="fixed inset-0 bg-black/70 z-40"
        />
      )}
    </>
  );
}