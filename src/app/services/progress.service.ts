import { Injectable } from '@angular/core';

export interface ProgressState {
  p1: boolean;
  p2: boolean;
  p3: boolean;
}

const STORAGE_KEY = 'exo_story_progress_v1';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private state: ProgressState = { p1: false, p2: false, p3: false };

  constructor() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { this.state = JSON.parse(raw); } catch { this.save(); }
    } else {
      this.save();
    }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  getState(): ProgressState {
    return { ...this.state };
  }

  setCompleted(puzzleNum: 1|2|3) {
    if (puzzleNum === 1) this.state.p1 = true;
    if (puzzleNum === 2) this.state.p2 = true;
    if (puzzleNum === 3) this.state.p3 = true;
    this.save();
  }

  resetAll() {
    this.state = { p1: false, p2: false, p3: false };
    this.save();
  }

  allCompleted(): boolean {
    return this.state.p1 && this.state.p2 && this.state.p3;
  }
}
