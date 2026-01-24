import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  showLoading = true;
  totalImages = 10;
  loadedImages = 0;
  constructor(private router: Router) {}
  audioSrc='https://res.cloudinary.com/derdez54y/video/upload/v1763529940/moster_lwe2tc.mp3';
  showUnmute = true;

  unmuteAudio() {
    const audio = document.getElementById('bg-audio') as HTMLAudioElement;
    if (audio) {
      audio.muted = false;
      this.audioSrc='https://res.cloudinary.com/derdez54y/video/upload/v1763529940/moster_lwe2tc.mp3';
      audio.play().catch(err => console.error(err));
    }
    this.showUnmute = false;
  }

  goToRoute(route: string): void {
    this.router.navigate([route]);
  }

  onImageLoad(): void {
    this.loadedImages++;

    if (this.loadedImages >= this.totalImages) {
      this.showLoading = false;
    }
  }
}
