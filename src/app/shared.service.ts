import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private nama: string = '';

  setNama(value: string) {
    this.nama = value;
  }

  getNama(): string {
    return this.nama;
  }
}
