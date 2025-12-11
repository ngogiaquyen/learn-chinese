// prisma/seed-shop.ts
// Chạy bằng lệnh: npx ts-node prisma/seed-shop.ts
// Hoặc thêm vào package.json: "seed:shop": "ts-node prisma/seed-shop.ts"

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const shopItems = [
  // 9 Pet – tất cả đều có lottieUrl thật
  {
    name: 'Rồng con',
    price: 500,
    type: 'PET' as const,
    image: 'https://images.unsplash.com/photo-1618496772270-1d2d8b4e4b0a?w=400&h=400&fit=crop',
    lottieUrl: 'https://products.ngogiaquyen.io.vn/assets/lottiefiles/baby-camel.json',
    description: 'Người bạn rồng dễ thương',
  },
  {
    name: 'Panda béo',
    price: 450,
    type: 'PET' as const,
    image: 'https://images.unsplash.com/photo-1564349680-3b9a7f4e8e8d?w=400&h=400&fit=crop',
    lottieUrl: 'https://products.ngogiaquyen.io.vn/assets/lottiefiles/cute-bird-flapping-animation.json',
    description: 'Panda mũm mĩm thích ăn bánh bao',
  },
  {
    name: 'Mèo Thần Tài',
    price: 400,
    type: 'PET' as const,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop',
    lottieUrl: 'https://products.ngogiaquyen.io.vn/assets/lottiefiles/long-dog.json',
    description: 'Vẫy tay mang tài lộc',
  },
  {
    name: 'Cáo Hồ Ly cute',
    price: 480,
    type: 'PET' as const,
    image: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400&h=400&fit=crop',
    lottieUrl: 'https://products.ngogiaquyen.io.vn/assets/lottiefiles/snail-dance.json',
    description: 'Cáo tinh nghịch, thông minh',
  },
  {
    name: 'Totoro đáng yêu',
    price: 550,
    type: 'PET' as const,
    image: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=400&h=400&fit=crop',
    lottieUrl: 'https://products.ngogiaquyen.io.vn/assets/lottiefiles/totoro-walk.json',
    description: 'Totoro hiền lành, thích đi dạo',
  },
  {
    name: 'Mèo chạy nhanh',
    price: 420,
    type: 'PET' as const,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop',
    lottieUrl: 'https://products.ngogiaquyen.io.vn/assets/lottiefiles/running-cat.json',
    description: 'Mèo năng động, thích chạy nhảy',
  },
  {
    name: 'Panda Tết Nguyên Đán',
    price: 480,
    type: 'PET' as const,
    image: 'https://images.unsplash.com/photo-1564349680-3b9a7f4e8e8d?w=400&h=400&fit=crop',
    lottieUrl: 'https://products.ngogiaquyen.io.vn/assets/lottiefiles/lunar-new-year-cute-panda.json',
    description: 'Panda phiên bản Tết cực kỳ dễ thương',
  },
  {
    name: 'Cậu bé nhảy vui',
    price: 380,
    type: 'PET' as const,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
    lottieUrl: 'https://products.ngogiaquyen.io.vn/assets/lottiefiles/yay-jump.json',
    description: 'Nhảy nhót vui vẻ, tràn đầy năng lượng',
  },
  {
    name: 'Lego vui nhộn',
    price: 520,
    type: 'PET' as const,
    image: 'https://images.unsplash.com/photo-1587654780291-39c940c2c5e4?w=400&h=400&fit=crop',
    lottieUrl: 'https://products.ngogiaquyen.io.vn/assets/lottiefiles/lego-1.json',
    description: 'Lego tí hon, thích chơi xếp hình',
  },

  // Theme
  {
    name: 'Theme Tết Trung Quốc',
    price: 300,
    type: 'THEME' as const,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop',
    description: 'Đỏ rực, đèn lồng, hoa mai',
  },
  {
    name: 'Theme Cổ Trang',
    price: 350,
    type: 'THEME' as const,
    image: 'https://images.unsplash.com/photo-1617971342115-4c8f4d0d3f2d?w=400&h=400&fit=crop',
    description: 'Thư pháp, gỗ nâu, cung đình',
  },

  // Avatar
  {
    name: 'Avatar Rồng Vàng',
    price: 200,
    type: 'AVATAR' as const,
    image: 'https://images.unsplash.com/photo-1618496772270-1d2d8b4e4b0a?w=400&h=400&fit=crop',
    description: 'Huy hiệu rồng uy nghiêm',
  },
  {
    name: 'Avatar Panda',
    price: 180,
    type: 'AVATAR' as const,
    image: 'https://images.unsplash.com/photo-1564349680-3b9a7f4e8e8d?w=400&h=400&fit=crop',
    description: 'Panda đáng yêu',
  },

  // Skin
  {
    name: 'Skin Rồng Vàng',
    price: 250,
    type: 'SKIN' as const,
    image: 'https://images.unsplash.com/photo-1618496772270-1d2d8b4e4b0a?w=400&h=400&fit=crop',
    description: 'Dành cho pet rồng',
  },
  {
    name: 'Skin Panda Đỏ',
    price: 220,
    type: 'SKIN' as const,
    image: 'https://images.unsplash.com/photo-1564349680-3b9a7f4e8e8d?w=400&h=400&fit=crop',
    description: 'Panda phiên bản Tết',
  },

  // Music
  {
    name: 'Nhạc Trung Quốc cổ điển',
    price: 150,
    type: 'MUSIC' as const,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    description: 'Nhạc đàn tranh, sáo trúc',
  },
  {
    name: 'Lofi Trung Quốc chill',
    price: 120,
    type: 'MUSIC' as const,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    description: 'Nhạc chill học bài',
  },
  {
    name: 'Nhạc phim cổ trang',
    price: 180,
    type: 'MUSIC' as const,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    description: 'Hùng tráng, cảm xúc',
  },
  // THEME
  {
    name: 'Theme Tết Trung Quốc',
    price: 300,
    type: 'THEME' as const,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop',
    description: 'Đỏ rực, đèn lồng, hoa mai',
  },
  {
    name: 'Theme Cổ Trang',
    price: 350,
    type: 'THEME' as const,
    image: 'https://images.unsplash.com/photo-1617971342115-4c8f4d0d3f2d?w=400&h=400&fit=crop',
    description: 'Thư pháp, gỗ nâu, cung đình',
  },

  // AVATAR
  {
    name: 'Avatar Rồng Vàng',
    price: 200,
    type: 'AVATAR' as const,
    image: 'https://images.unsplash.com/photo-1618496772270-1d2d8b4e4b0a?w=400&h=400&fit=crop',
    description: 'Huy hiệu rồng uy nghiêm',
  },
  {
    name: 'Avatar Panda',
    price: 180,
    type: 'AVATAR' as const,
    image: 'https://images.unsplash.com/photo-1564349680-3b9a7f4e8e8d?w=400&h=400&fit=crop',
    description: 'Panda đáng yêu',
  },

  // SKIN
  {
    name: 'Skin Rồng Vàng',
    price: 250,
    type: 'SKIN' as const,
    image: 'https://images.unsplash.com/photo-1618496772270-1d2d8b4e4b0a?w=400&h=400&fit=crop',
    description: 'Dành cho pet rồng',
  },
  {
    name: 'Skin Panda Đỏ',
    price: 220,
    type: 'SKIN' as const,
    image: 'https://images.unsplash.com/photo-1564349680-3b9a7f4e8e8d?w=400&h=400&fit=crop',
    description: 'Panda phiên bản Tết',
  },

  // MUSIC
  {
    name: 'Nhạc Trung Quốc cổ điển',
    price: 150,
    type: 'MUSIC' as const,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    description: 'Nhạc đàn tranh, sáo trúc',
  },
  {
    name: 'Lofi Trung Quốc chill',
    price: 120,
    type: 'MUSIC' as const,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    description: 'Nhạc chill học bài',
  },
  {
    name: 'Nhạc phim cổ trang',
    price: 180,
    type: 'MUSIC' as const,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    description: 'Hùng tráng, cảm xúc',
  },
];

async function main() {
  console.log('Đang seed sản phẩm shop...');
  const result = await prisma.shopItem.createMany({
    data: shopItems,
    skipDuplicates: true,
  });
  console.log(`Đã thêm thành công ${result.count} sản phẩm vào shop!`);
}

main()
  .catch((e) => {
    console.error('Lỗi:', e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());