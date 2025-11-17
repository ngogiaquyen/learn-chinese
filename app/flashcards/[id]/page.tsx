'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import FlashCardForm from '@/app/components/FlashCardForm';
import Link from 'next/link';
import { FlashCardItem } from '@/app/types/flashCardItem';


export default function EditFlashCardPage() {
  const { id } = useParams();
  const [card, setCard] = useState<FlashCardItem | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCard = async () => {
      const res = await fetch('/api/flashcards');
      const data = await res.json();
      const currentCard = data.find((c: FlashCardItem) => c.id === Number(id));
      setCard(currentCard);
    };
    fetchCard();
  }, [id]);

  if (!card) return <p className="text-center mt-10">Loading...</p>;

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Chỉnh sửa Flash Card</h1>
      <FlashCardForm initialData={card} />
      <div className="text-center mt-4">
        <Link href="/flashcards" className="text-blue-500 hover:underline">
          Quay lại danh sách
        </Link>
      </div>
    </main>
  );
}
