import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, doc, setDoc, updateDoc, increment } from '@angular/fire/firestore';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-guess-song',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guess-song.component.html',
  styleUrls: ['./guess-song.component.scss'],
})
export class GuessSongComponent {
  @Input() audioSrc!: string;
  @Input() options!: { text: string; img: string; isCorrect: boolean }[];
  @Output() nextSongEvent = new EventEmitter<void>();
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  @Output() answerEvent = new EventEmitter<boolean>();

  clipDuration = 5;
  clipTimeout: any;

  selectedOption: any = null;
  showPopup = false;
  isCorrect = false;
  showConfirmPopup = false;

  playCount = 0;
  maxPlayCount = 3;
  clipStart: number | null = null;
  isPlaying = false;

  @Input() correctPoints :number = 0;
  @Input() wrongPoints :number = 0;  

  userId! : string;

  constructor(private firestore: Firestore, private shared: SharedService) {}

  ngOnInit(): void {
    this.userId = this.shared.getUserId();
  }
  
  selectOption(opt: any) {
    this.selectedOption = opt;
    this.showConfirmPopup = true;
  }

  cancelConfirm() {
    this.showConfirmPopup = false;
  }

  confirmAnswer() {
    this.showConfirmPopup = false;
    this.checkAnswer();
  }

  checkAnswer() {
    this.isCorrect = this.selectedOption.isCorrect;

    this.answerEvent.emit(this.isCorrect);

    this.updateFirebasePoints();

    this.showPopup = true;
  }

  nextQuestion() {
    this.showPopup = false;
    this.playCount = 0;
    this.clipStart = null; 
    this.nextSongEvent.emit();
  }

  restartQuestion() {
    this.showPopup = false;
    this.selectedOption = null;
  }

  playRandomClip() {
    const audio = this.audioPlayer.nativeElement;

    if (this.playCount >= this.maxPlayCount) return;

    if (this.clipStart === null && audio.duration > this.clipDuration) {
      const maxStart = Math.max(audio.duration - this.clipDuration, 0);
      this.clipStart = Math.random() * maxStart;
    }

    const start = this.clipStart ?? 0;
    const end = start + this.clipDuration;

    audio.currentTime = start;
    audio.play();
    this.isPlaying = true;
    this.playCount++;

    const stopAtEnd = () => {
      if (audio.currentTime >= end) {
        audio.pause();
        this.isPlaying = false;
        audio.removeEventListener('timeupdate', stopAtEnd);
      }
    };

    audio.addEventListener('timeupdate', stopAtEnd);
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
