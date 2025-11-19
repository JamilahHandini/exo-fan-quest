import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

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

}
