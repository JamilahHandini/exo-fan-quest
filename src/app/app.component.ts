import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FallingStarsComponent } from '../app/falling-stars/falling-stars.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FallingStarsComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'exo-fan-quest';
  shopeeUrl = 'https://shopee.co.id/shop/1493041562';
  shareMenuOpen = false;
  constructor(private router: Router) {}

  goToRoute(route: string): void {
    this.router.navigate([route]);
  }

  openShopee(): void {
    const url = 'https://shopee.co.id/shop/1493041562';
    window.open(url, '_blank', 'noopener,noreferrer');
  }    

  get waShareUrl(): string {
    const text = `Cek toko Shopee aku ya: ${this.shopeeUrl}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }

  get telegramShareUrl(): string {
    const text = `Cek toko Shopee aku ya: ${this.shopeeUrl}`;
    return `https://t.me/share/url?url=${encodeURIComponent(this.shopeeUrl)}&text=${encodeURIComponent(text)}`;
  }

  async handleShare(): Promise<void> {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Toko Shopee',
          text: 'Cek toko Shopee aku ya!',
          url: this.shopeeUrl,
        });
        return;
      } catch {
      }
    }

    this.shareMenuOpen = true;
  }
  
  closeShareMenu(): void {
  this.shareMenuOpen = false;
}

async copyLink(): Promise<void> {
  try {
      await navigator.clipboard.writeText(this.shopeeUrl);
  } catch {
      const ta = document.createElement('textarea');
      ta.value = this.shopeeUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
  }
      this.shareMenuOpen = false;
      alert('Link sudah dicopy. Silakan paste ke WhatsApp/Instagram.');
  }
}

