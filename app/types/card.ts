export interface Card {
  id: number;
  chinese: string;
  pinyin: string;
  meaning: string;
  hskLevel: number;
  status: 'NOT_LEARNED' | 'LEARNING' | 'REVIEW' | 'MASTERED';
}
