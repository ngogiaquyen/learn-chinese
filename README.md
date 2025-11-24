# 1. Tạo migration mới để thêm lại cột hsk_level
npx prisma migrate dev --name add_hsk_level_final

# 2. Tạo lại client
npx prisma generate

# 3. Seed 150 từ HSK 1 (file seed.ts mình đã sửa thành prisma.flashcard)
npx prisma db seed