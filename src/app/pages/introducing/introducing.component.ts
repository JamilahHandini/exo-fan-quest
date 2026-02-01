import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../shared.service';
import { ReferralService } from '../../services/referrals.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-introducing',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './introducing.component.html',
  styleUrl: './introducing.component.css'
})
export class IntroducingComponent {

  userForm!: FormGroup;
  showLoading = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private shared: SharedService, 
    private referralService: ReferralService
  ) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      kodeReferral: ['', Validators.required],
    });
  }

  getControl(controlName: string) {
    return this.userForm.get(controlName);
  }

  async onSubmit() {
    const name = this.userForm.get('name')?.value;
    const username = this.userForm.get('username')?.value;
    const kode = this.userForm.get('kodeReferral')?.value;

    this.showLoading = true;
    let refData: any = await this.referralService.findReferral(kode);
    this.shared.setUserId(refData?.id);
    
    const storedData = localStorage.getItem('userReferralAccess');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      this.shared.setNama(parsedData.name);
      this.router.navigate(['starting-journey']);
      if (parsedData.username === username) {
        return;
      }
    }

    if (!refData) {
      this.showLoading = false;
      Swal.fire({
        icon: 'error',
        title: 'Kode Tidak Valid',
        text: 'Kode referral tidak ditemukan.',
        confirmButtonText: 'Coba Lagi',
        confirmButtonColor: '#ff6b81',
      });
      return;
    }

    if (!refData?.used) {
      
      this.shared.setNama(name);
      this.shared.setUserId(refData?.id);

      await this.referralService.markUsed(refData.id);

      localStorage.setItem(
        'userReferralAccess',
        JSON.stringify({
          userId: refData?.id,
          name: name,
          rewardLinkFront: refData?.rewardLinkFront,
          rewardLinkBack: refData?.rewardLinkBack,
          referralCode: kode,
          timestamp: new Date().toISOString(),
        })
      );

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Kode referral valid. Yuk lanjut!',
      });

      this.showLoading = false;
      this.router.navigate(['starting-journey']);
      return;
    }

    if (refData.used && refData.username === username) {
      this.shared.setNama(name);
      this.shared.setUserId(refData?.id);

      localStorage.setItem(
        'userReferralAccess',
        JSON.stringify({
          name: name,
          rewardLinkFront: refData?.rewardLinkFront,
          rewardLinkBack: refData?.rewardLinkBack,
          referralCode: kode,
          timestamp: new Date().toISOString(),
        })
      );

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Kode referral valid. Yuk lanjut!',
      });
      this.showLoading = false;
      this.router.navigate(['starting-journey']);
      return;
    }

    if (refData.used && refData.username !== username) {
      this.showLoading = false;
      Swal.fire({
        icon: 'error',
        title: 'Kode Tidak Valid',
        text: 'Kode kadaluarsa',
        confirmButtonText: 'Coba Lagi',
        confirmButtonColor: '#ff6b81',
      });
      return;
    }
  }
}
