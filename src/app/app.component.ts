import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FallingStarsComponent } from '../app/falling-stars/falling-stars.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FallingStarsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'exo-fan-quest';
  constructor(private router: Router) {}

  goToRoute(route: string): void {
    this.router.navigate([route]);
  }
}

