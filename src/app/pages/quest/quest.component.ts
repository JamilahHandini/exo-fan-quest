import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quest',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.scss'],
})
export class QuestComponent implements OnInit, OnDestroy {
  @Input() question!: string;
  @Input() options: any[] = [];
  @Output() nextQuestionEvent = new EventEmitter<void>();

  selectedOption: any = null;
  showPopup = false;
  isCorrect = false;
  confirmed = false;
  resultShown = false;

  timeLeft = 15;
  maxTime = 15;
  timer: any;
  timeUp = false;
  progress = "360deg"; 

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  clearTimer() {
      if (this.timer) clearInterval(this.timer);
  }

  resetState() {
      this.clearTimer();
      this.selectedOption = null;
      this.showPopup = false;
      this.isCorrect = false;
      this.confirmed = false;
      this.resultShown = false;
      this.timeUp = false;
  }

  startTimer() {
      this.clearTimer(); 
      this.timeLeft = this.maxTime;
      this.timeUp = false;
      this.showPopup = false;
      this.resultShown = false;

      this.timer = setInterval(() => {
          this.timeLeft--;

          const percent = this.timeLeft / this.maxTime;
          this.progress = (percent * 360) + "deg";

          if (this.timeLeft <= 0) {
            this.clearTimer();
            this.timeUp = true;
            this.showPopup = true;
          }
      }, 1000);
  }

  selectOption(option: any) {
    if (this.selectedOption) return;

    this.selectedOption = option;
    this.showPopup = true;
    this.clearTimer();
  }

  confirmAnswer() {
    this.confirmed = true;
    this.isCorrect = this.selectedOption.isCorrect;
    this.resultShown = true;
  }

    
  nextQuestion() {
      this.resetState();
      this.startTimer();
      this.nextQuestionEvent.emit();
  }

  restartQuestion() {
      this.resetState();
      this.startTimer();
  }

  cancelAnswer() {
      this.resetState();
      this.startTimer();
  }
}
