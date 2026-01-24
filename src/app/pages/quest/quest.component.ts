import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, doc, setDoc, updateDoc, increment } from '@angular/fire/firestore';
import { SharedService } from '../../shared.service';

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
  @Output() answerEvent = new EventEmitter<boolean>();

  selectedOption: any = null;
  showPopup = false;
  isCorrect = false;
  confirmed = false;
  resultShown = false;

  timeLeft = 8;
  maxTime = 8;
  timer: any;
  timeUp = false;
  progress = "360deg"; 

  @Input() correctPoints :number = 0;
  @Input() wrongPoints :number = 0;  

  userId! : string;

  constructor(private firestore: Firestore, private shared: SharedService) {}

  ngOnInit(): void {
    this.startTimer();
    this.userId = this.shared.getUserId();
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
            
            this.answerEvent.emit(false);
            this.updateFirebasePoints();
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

    this.answerEvent.emit(this.isCorrect);
    this.updateFirebasePoints();
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

  updateFirebasePoints() {
    if (!this.userId) return;

    const userRef = doc(this.firestore, 'referrals', this.userId);

    updateDoc(userRef, {
      correctPoints: increment(this.isCorrect ? 1 : 0),
      wrongPoints: increment(!this.isCorrect ? 1 : 0)
    }).catch(err => console.error('Firebase update error:', err));
  }
}
