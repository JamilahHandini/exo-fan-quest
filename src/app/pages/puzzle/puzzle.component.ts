import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Firestore, doc, setDoc, updateDoc, increment } from '@angular/fire/firestore';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-puzzle',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss'],
})
export class PuzzleComponent implements OnInit {
  @Input() title: string = 'Puzzle — Susun Gambar';
  @Input() instruction: string = 'Susun potongan gambar agar membentuk gambar utuh!';
  @Input() question: string = 'Susun potongan gambar agar membentuk gambar utuh!';
  @Input() items: any[] = [];
  @Input() answers: any[] = [];


  @Output() nextPuzzleEvent = new EventEmitter<void>();
  @Output() answerEvent = new EventEmitter<boolean>();

  pieces: any[] = [];
  slots: (any | null)[] = [];

  message = '';
  showPopup = false;
  isCorrect = false;

  @Input() correctPoints :number = 0;
  @Input() wrongPoints :number = 0;  

  userId! : string;

  constructor(private firestore: Firestore, private shared: SharedService) {}

  ngOnInit(): void {
    this.shufflePieces();
  }

  shufflePieces() {
    this.slots = Array(this.items.length).fill(null);
    this.pieces = [...this.items].sort(() => Math.random() - 0.5);
  }

  checkAnswer() {
    const correct = this.slots.every((v, i) => v === this.answers[i]);
    this.isCorrect = correct;
    this.showPopup = true;
    this.message = correct
      ? '✨ Hebat! Puzzle selesai dengan benar! ✨'
      : '😢 Masih salah, coba lagi ya!';

    this.answerEvent.emit(this.isCorrect);
    this.updateFirebasePoints();
  }

  closePopup() {
    this.showPopup = false;
    if (this.isCorrect) this.nextPuzzleEvent.emit();
  }

  reset() {
    this.slots = Array(this.items.length).fill(null);
    this.shufflePieces();
    this.message = '';
    this.showPopup = false;
  }

  onDropSlot(event: CdkDragDrop<any>) {
    const toData = event.container.data as { type: string; index?: number };
    const fromData = event.previousContainer.data as { type: string; index?: number };

    const slotIndex = toData.index!;
    const from: 'pool' | number =
      fromData.type === 'slot' && typeof fromData.index === 'number'
        ? fromData.index
        : 'pool';

    const item = event.item.data;

    if (typeof from === 'number') {
      this.slots[from] = null;
    } else {
      const idx = this.pieces.findIndex((p) => p.value === item.value);
      if (idx > -1) this.pieces.splice(idx, 1);
    }

    if (this.slots[slotIndex]) {
      this.pieces.push(this.slots[slotIndex]);
    }

    this.slots[slotIndex] = item;
  }

  onDropBackToPool(event: CdkDragDrop<any>) {
    const fromData = event.previousContainer.data as { type: string; index?: number };
    const from: 'pool' | number =
      fromData.type === 'slot' && typeof fromData.index === 'number'
        ? fromData.index
        : 'pool';

    const item = event.item.data;

    if (typeof from === 'number') {
      this.slots[from] = null;
    }

    if (!this.pieces.some((p) => p.value === item.value)) {
      this.pieces.push(item);
    }
  }

  updateFirebasePoints() {
    if (!this.userId) return;

    const userRef = doc(this.firestore, 'referrals', this.userId);

    updateDoc(userRef, {
      correctPoints: increment(this.isCorrect ? 1 : 0),
      wrongPoints: increment(!this.isCorrect ? 1 : 0)
    }).catch(err => console.error('Firebase update error:', err));
  }
}
