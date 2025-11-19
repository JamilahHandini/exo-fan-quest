import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuzzleComponent } from '../puzzle/puzzle.component';
import confetti from 'canvas-confetti';
import { Router, RouterLink } from '@angular/router';
import { PuzzleService, Puzzle } from '../../services/puzzle.service';

@Component({
  selector: 'app-puzzle-container',
  standalone: true,
  imports: [CommonModule, PuzzleComponent, RouterLink],
  templateUrl: './puzzle-container.component.html',
  styleUrls: ['./puzzle-container.component.scss'],
})
export class PuzzleContainerComponent {
  showIntroPopup = true;
  showLoading = false;
  puzzleStarted = false;
  showEndPopup = false;

  chapterInfo = {
    title: 'Chapter Puzzle — Susun Urutan!',
    totalPuzzles: 3,
    description:
      'Di chapter ini kamu akan menguji kecepatan dan logika kamu untuk menyusun puzzle dengan benar! Susun yang rapi dan benar yaa biar ga kena omel bang Umin dan Baekhyun!',
  };

  currentPuzzleIndex = 0;

  puzzles: Puzzle[] = [];
  randomMeme = '';

  constructor(
    private router: Router,
    private puzzleService: PuzzleService
  ) {}

  async ngOnInit(): Promise<void> {
    const userAccess = localStorage.getItem('userReferralAccess');
    if (!userAccess) {
      this.router.navigate(['/introducing']);
      return;
    }

    await this.loadPuzzles();
  }

  async loadPuzzles() {
    this.showLoading = true;

    try {
      const fetched = await this.puzzleService.getShuffledPuzzles(
        this.chapterInfo.totalPuzzles
      );

      this.puzzles = fetched;
      console.log(this.puzzles)

      setTimeout(() => {
        this.showLoading = false;
      }, 500);

    } catch (err) {
      console.error(err);
      this.showLoading = false;
    }
  }

  startPuzzle() {
    this.showIntroPopup = false;
    this.showLoading = true;

    setTimeout(() => {
      this.showLoading = false;
      this.puzzleStarted = true;
    }, 1500);
  }

  handleNextPuzzle() {
    this.currentPuzzleIndex++;

    if (this.currentPuzzleIndex < this.puzzles.length) {
      this.puzzleStarted = false;

      setTimeout(() => {
        this.puzzleStarted = true;
      }, 300);

    } else {
      this.puzzleStarted = false;
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

    this.randomMeme = memes[Math.floor(Math.random() * memes.length)];

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
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  nextChapter(route: string): void {
    this.showEndPopup = false;
    this.router.navigate([route]);
  }
}
