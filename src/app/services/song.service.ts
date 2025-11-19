import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  query, 
  getDocs, 
  CollectionReference, 
  DocumentData 
} from '@angular/fire/firestore';

export interface Option {
  id: number;
  img: string;
  text: string;
  isCorrect: boolean;
}

export interface Song {
  id?: string; 
  audiosrc: string;
  options: Option[];
}

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private collectionName = 'songs'; 

  constructor(private firestore: Firestore) {}

  async getShuffledSongs(limit: number = 10): Promise<Song[]> {
    const ref = collection(this.firestore, this.collectionName);
    const q = query(ref);

    try {
      const querySnapshot = await getDocs(q);
      const allSongs: Song[] = [];

      querySnapshot.forEach(doc => {
        allSongs.push({ 
          id: doc.id, 
          ...doc.data() as Song 
        });
      });

      const shuffledQuestions = this.shuffleArray(allSongs);
      const limitedQuestions = shuffledQuestions.slice(0, limit);
      const finalQuestions = limitedQuestions.map(q => ({
        ...q,
        options: this.shuffleArray([...q.options]),
      }));
      
      return finalQuestions;

    } catch (error) {
      console.error('Error fetching shuffled questions:', error);
      throw new Error('Gagal mengambil pertanyaan dari database.'); 
    }
  }

  private shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}