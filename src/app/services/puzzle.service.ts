import { Injectable } from '@angular/core';
import { 
  Firestore,
  collection,
  query,
  getDocs
} from '@angular/fire/firestore';

// Struktur item puzzle
export interface PuzzleItem {
  value: string;
  img: string;
}

// Struktur puzzle
export interface Puzzle {
  id?: string;
  title: string;
  question: string;
  instruction: string;
  items: PuzzleItem[];
}

@Injectable({
  providedIn: 'root'
})
export class PuzzleService {
  private collectionName = 'puzzles';

  constructor(private firestore: Firestore) {}

  async getShuffledPuzzles(limit: number = 10): Promise<Puzzle[]> {
    const ref = collection(this.firestore, this.collectionName);
    const q = query(ref);

    try {
      const querySnapshot = await getDocs(q);
      const allPuzzles: Puzzle[] = [];

      querySnapshot.forEach(doc => {
        const data = doc.data() as Puzzle;

        allPuzzles.push({
          id: doc.id,
          ...data
        });
      });

      const shuffled = this.shuffleArray(allPuzzles);

      const limited = shuffled.slice(0, limit);

      const finalPuzzles = limited.map(p => ({
        ...p,
        items: [...p.items]
      }));

      return finalPuzzles;

    } catch (error) {
      console.error('Error fetching puzzles:', error);
      throw new Error('Gagal mengambil data puzzle dari Firebase');
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}