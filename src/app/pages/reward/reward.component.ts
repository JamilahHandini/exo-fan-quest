import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import confetti from 'canvas-confetti';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-reward',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reward.component.html',
  styleUrls: ['./reward.component.css']
})
export class RewardComponent implements AfterViewInit {
  photocardUrl = 'assets/photocard/exo_kyungsoo.png';

  hasSharedInstagram = false;
  hasSharedTwitter = false;

  showThankYouPopup = true;

  rewardLinkFront = "";
  rewardLinkBack = "";

  constructor(private router: Router) {}

  ngOnInit() {
    let userAccess : any;
    userAccess = localStorage.getItem('userReferralAccess');
    userAccess = JSON.parse(userAccess);
    this.rewardLinkFront = userAccess?.rewardLinkFront;
    this.rewardLinkBack = userAccess?.rewardLinkBack;

    if (!userAccess) {
      this.router.navigate(['/introducing']);
      return;
    }
  }

  ngAfterViewInit() {
    this.showThankYouPopup = true;
  }

  closeThankYouPopup() {
    this.showThankYouPopup = false;
    this.launchConfetti();
  }

  launchConfetti() {
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  shareInstagram() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      const imageUrl = 'https://yourcdn.com/photocard.jpg';
      try {
        window.location.href = `intent://share/story?source=${imageUrl}#Intent;scheme=instagram;package=com.instagram.android;end`;
      } catch {
        alert('Gagal membuka Instagram. Coba buka manual dari aplikasi.');
      }
    } else {
      alert('Fitur share ke story hanya bisa dari HP 📱');
      window.open('https://www.instagram.com/', '_blank');
    }
    this.hasSharedInstagram = true;
  }

  shareTwitter() {
    const tweetText = encodeURIComponent('Aku baru dapet photocard EXO digital dari Jjomira Corner 💖 #EXOL #EXO');
    const shareUrl = 'https://jjomiracorner.com/reward';
    const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(shareUrl)}`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = twitterIntentUrl;
    } else {
      window.open(twitterIntentUrl, '_blank');
    }
    this.hasSharedTwitter = true;
  }


  claimReward() {
    const link = document.createElement('a');
    link.href = 'assets/images/rewards/kyungsoo.jpg';
    link.download = 'baekhyun_photocard.jpg';
    link.click(); 
  }

}
