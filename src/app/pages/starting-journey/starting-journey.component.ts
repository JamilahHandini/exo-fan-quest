import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-introducing',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './starting-journey.component.html',
  styleUrl: './starting-journey.component.css'
})
export class StartingJourneyComponent {

  userName = '';

  constructor(private fb: FormBuilder, private router: Router, private shared: SharedService) {}

  ngOnInit() {
      const userAccess = localStorage.getItem('userReferralAccess');
      if (!userAccess) {
        this.router.navigate(['/introducing']);
        return;
      }
      this.userName = this.shared.getNama();
  }

  goToRoute(route: string): void {
    this.router.navigate([route]);
  }
}
