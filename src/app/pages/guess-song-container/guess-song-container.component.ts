import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuessSongComponent } from '../guess-song/guess-song.component';
import confetti from 'canvas-confetti';
import { Router, RouterLink } from '@angular/router';
import { SongService, Song } from '../../services/song.service';

@Component({
  selector: 'app-guess-song-container',
  standalone: true,
  imports: [CommonModule, GuessSongComponent, RouterLink],
  templateUrl: './guess-song-container.component.html',
  styleUrls: ['./guess-song-container.component.scss'],
})
export class GuessSongContainerComponent {
  showIntroPopup = true;
  showLoading = false;
  showEndPopup = false;
  gameStarted = false;
  currentSongIndex = 0;
  randomMeme = '';

  chapterInfo = {
    title: 'Chapter Tebak Lagu — Tebak Judulnya!',
    totalSongs: 5,
    description: 'Dengarkan potongan lagu EXO dan pilih gambar lagu yang benar (Pakai headset dan sesuaikan volume untuk pengalaman yang lebih baik)! Jangan sampai kecewain abang Lay dan Kai ya! karena kamu lupa lagu mereka ^_^ ',
  };

  songs: any[] = [];

  constructor(private router: Router, private songService: SongService) {}

  ngOnInit(): void {
    const userAccess = localStorage.getItem('userReferralAccess');
    if (!userAccess) {
      this.router.navigate(['/introducing']);
      return;
    }
    this.prepareSongs();
  }

  async prepareSongs() {
    this.showLoading = true;

      try {
        this.songs = await this.songService.getShuffledSongs(this.chapterInfo.totalSongs);
        
        this.showLoading = false;
        
      } catch (error) {
        console.error('Gagal memuat kuis:', error);
        this.showLoading = false;
      }
  }

  startGame() {
    this.showIntroPopup = false;
    this.showLoading = true;
    setTimeout(() => {
      this.showLoading = false;
      this.gameStarted = true;
    }, 1500);
  }

  handleNextSong() {
    this.currentSongIndex++;
    if (this.currentSongIndex < this.songs.length) {
      this.gameStarted = false;
      setTimeout(() => (this.gameStarted = true), 100);
    } else {
      this.gameStarted = false;
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
    const end = Date.now() + 3 * 1000;
    (function frame() {
      confetti({ particleCount: 5, spread: 70, origin: { y: 0.6 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  nextChapter(route: string) {
    this.showEndPopup = false;
    this.router.navigate([route]);
  }
}
