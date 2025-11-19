import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

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

  pieces: any[] = [];
  slots: (any | null)[] = [];

  message = '';
  showPopup = false;
  isCorrect = false;

  constructor() {}

  ngOnInit(): void {
    this.shufflePieces();
  }

  shufflePieces() {
    this.slots = Array(this.items.length).fill(null);
    this.pieces = [...this.items].sort(() => Math.random() - 0.5);
  }

  checkAnswer() {
    console.log('slots', this.slots);
    console.log('images', this.answers);
    const correct = this.slots.every((v, i) => v === this.answers[i]);
    this.isCorrect = correct;
    this.showPopup = true;
    this.message = correct
      ? '✨ Hebat! Puzzle selesai dengan benar! ✨'
      : '😢 Masih salah, coba lagi ya!';
  }

  closePopup() {
    this.showPopup = false;
    if (this.isCorrect) this.nextPuzzleEvent.emit();
  }

  reset() {
    // aslinya pakai images.length, aku biarkan sama supaya logika kamu nggak berubah
    this.slots = Array(this.items.length).fill(null);
    this.shufflePieces();
    this.message = '';
    this.showPopup = false;
  }

  /**
   * Drop ke salah satu slot di grid puzzle
   */
  onDropSlot(event: CdkDragDrop<any>) {
    const toData = event.container.data as { type: string; index?: number };
    const fromData = event.previousContainer.data as { type: string; index?: number };

    // index slot tujuan
    const slotIndex = toData.index!;
    // asal: 'pool' atau index slot
    const from: 'pool' | number =
      fromData.type === 'slot' && typeof fromData.index === 'number'
        ? fromData.index
        : 'pool';

    const item = event.item.data;

    // === LOGIKA LAMA onDrop (disesuaikan ke CDK) ===
    // Hapus dari slot asal kalau dari slot
    if (typeof from === 'number') {
      this.slots[from] = null;
    } else {
      // Hapus dari pool kalau asalnya pool
      const idx = this.pieces.findIndex((p) => p.value === item.value);
      if (idx > -1) this.pieces.splice(idx, 1);
    }

    // Jika slot tujuan sudah berisi, pindahkan isi lamanya ke pool
    if (this.slots[slotIndex]) {
      this.pieces.push(this.slots[slotIndex]);
    }

    // Masukkan item ke slot tujuan
    this.slots[slotIndex] = item;
  }

  /**
   * Drop kembali ke pool (pieces-grid)
   */
  onDropBackToPool(event: CdkDragDrop<any>) {
    const fromData = event.previousContainer.data as { type: string; index?: number };
    const from: 'pool' | number =
      fromData.type === 'slot' && typeof fromData.index === 'number'
        ? fromData.index
        : 'pool';

    const item = event.item.data;

    // === LOGIKA LAMA onDropBackToPool (disesuaikan ke CDK) ===
    // Kosongkan slot asal jika dari slot
    if (typeof from === 'number') {
      this.slots[from] = null;
    }

    // Hindari duplikasi di pool
    if (!this.pieces.some((p) => p.value === item.value)) {
      this.pieces.push(item);
    }
  }
}
