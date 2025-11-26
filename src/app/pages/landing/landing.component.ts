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
