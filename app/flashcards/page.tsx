"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import FlashCard from "@/app/components/FlashCard";
import { FlashCardItem } from "../types/flashCardItem";

export default function FlashcardsPage() {
  const [cards, setCards] = useState<FlashCardItem[]>([]);

  useEffect(() => {
    let isMounted = true; // guard tránh setState khi component unmount

    const fetchCards = async () => {
      try {
        const res = await fetch("/api/flashcards");
        const data = await res.json();
        if (isMounted) setCards(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCards();

    return () => {
      isMounted = false;
    };
  }, []);

  const deleteCard = async (id: number) => {
    await fetch("/api/flashcards", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    // gọi fetchCards mới sau khi delete
    const res = await fetch("/api/flashcards");
    const data = await res.json();
    setCards(data);
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Quản lý Flash Card
      </h1>
      <div className="text-center mb-6">
        <Link
          href="/flashcards/new"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Thêm Flash Card
        </Link>
      </div>
      <div className="flex flex-wrap justify-center">
        {cards.map((card) => (
          <div key={card.id} className="m-2 border p-4 rounded shadow">
            <FlashCard
              id={card.id}
              status={
                card.status as
                  | "NOT_LEARNED"
                  | "LEARNING"
                  | "REVIEW"
                  | "MASTERED"
              }
              chinese={card.chinese}
              pinyin={card.pinyin}
              meaning={card.meaning}
            />
            <div className="flex justify-between mt-2">
              <Link
                href={`/flashcards/${card.id}`}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Sửa
              </Link>
              <button
                onClick={() => deleteCard(card.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
