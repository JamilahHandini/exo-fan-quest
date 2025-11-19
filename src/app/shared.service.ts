import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private nama: string = '';
  private rewardLink: string = '';

  setNama(value: string) {
    this.nama = value;
  }

  getNama(): string {
    return this.nama;
  }

  setRewardLink(value: string) {
    this.rewardLink = value;
  }

  getRewardLink(): string {
    return this.rewardLink;
  }
}
