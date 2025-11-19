import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestComponent } from '../quest/quest.component';
import confetti from 'canvas-confetti';
import { RouterLink, Router } from '@angular/router';
import { QuestionService, Question } from '../../services/question.service';

@Component({
  selector: 'app-quest-container',
  standalone: true,
  imports: [CommonModule, QuestComponent],
  templateUrl: './quest-container.component.html',
  styleUrls: ['./quest-container.component.scss'],
})
export class QuestContainerComponent {
  showIntroPopup = true;
  showLoading = false;
  quizStarted = false;
  showEndPopup = false;
  questions: Question[] = [];

  chapterInfo = {
    title: 'Chapter Quiz',
    totalQuestions: 10,
    timePerQuestion: 15,
    description:
      'Di chapter ini kamu akan menjawab 10 pertanyaan seputar EXO dan Membernya! Setiap soal punya waktu 15 detik, jadi fokus ya biar ga dimarahin Kyungsoo dan kena tabok Chanyeol😆',
  };

  currentQuestionIndex = 0;
  randomMeme: string = '';

  constructor(private router: Router, private questionService: QuestionService) {}

  ngOnInit(): void {
    const userAccess = localStorage.getItem('userReferralAccess');
    if (!userAccess) {
      this.router.navigate(['/introducing']);
      return;
    }
  }

  async prepareQuestions() {
      this.showLoading = true;

      try {
        this.questions = await this.questionService.getShuffledQuestions(this.chapterInfo.totalQuestions);
        
        this.showLoading = false;
        this.quizStarted = true;
        
      } catch (error) {
        console.error('Gagal memuat kuis:', error);
        this.showLoading = false;
      }
  }

  startQuiz() {
    this.showIntroPopup = false;
    this.showLoading = true;

    this.prepareQuestions();

    setTimeout(() => {
      this.showLoading = false;
      this.quizStarted = true;
    }, 2000);
  }

  handleNextQuestion() {
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex < this.questions.length) {
      this.quizStarted = false;
      setTimeout(() => {
        this.quizStarted = true;
      }, 50);
    } else {
      this.quizStarted = false;
      this.triggerVictoryPopup();
    }
  }

  triggerVictoryPopup() {
    this.showEndPopup = true;
      const memes = [
    'assets/memes/exo-happy.gif',
    'assets/memes/exo-chanyeol-laugh.gif',
    'assets/memes/exo-clap.gif',
  ];
    const randomMeme = memes[Math.floor(Math.random() * memes.length)];
    this.randomMeme = randomMeme;
    this.launchConfetti();
  }

  launchConfetti() {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        spread: 70,
        origin: { y: 0.6 },
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

  nextChapter(route: string): void {
    this.showEndPopup = false
    this.router.navigate([route]);
  }
}
