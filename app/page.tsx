// app/page.tsx
import CardList from "@/app/components/CardList";
import StatsPanel from "@/app/components/StatsPanel";
import { getFlashCards } from "./lib/getFlashCards";

export default async function Home() {
  const cards = await getFlashCards();
  console.log("Tổng số thẻ flashcard:", cards.length);
  console.log("Thẻ flashcard mẫu:", cards.slice(0, 3));
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-gray-950 to-black text-white">
      {/* Tiêu đề nhỏ gọn */}
      <div className="text-center pt-4 pb-2">
        <h1 className="text-1xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
          Trang chủ
        </h1>
      </div>

      {/* Danh sách thẻ - chừa chỗ trên để panel trượt xuống */}
      <div className="px-4 pt-4">
        <CardList cards={cards} />
      </div>

      {/* Panel trượt từ trên xuống */}
      <StatsPanel cards={cards} />
    </main>
  );
}