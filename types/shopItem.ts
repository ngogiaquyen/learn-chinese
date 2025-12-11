export type ShopItem = {
  id: number;
  name: string;
  description: string | null; // có thể null nếu không bắt buộc
  image: string | null;       // link ảnh (Unsplash, Cloudinary, v.v.)
  price: number;
  type: "MUSIC" | "VIDEO" | "IMAGE" | "OTHER"; // nếu có nhiều loại, thêm enum
  isActive: boolean;
  createdAt: Date | string;   // Prisma trả về Date, nhưng JSON trả về string
  updatedAt: Date | string;
  lottieUrl: string | null;   // dùng cho animation Lottie nếu có
};