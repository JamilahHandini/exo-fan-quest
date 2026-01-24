import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private userId: string = '';
  private nama: string = '';
  private rewardLink: string = '';

  setUserId(value: string) {
    this.userId = value;
  }

  getUserId(): string {
    return this.userId;
  }

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
