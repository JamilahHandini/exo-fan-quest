import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { IntroducingComponent } from './pages/introducing/introducing.component';
import { PuzzleContainerComponent } from './pages/puzzle-container/puzzle-container.component';
import { RewardComponent } from './pages/reward/reward.component';
import { QuestContainerComponent } from './pages/quest-container/quest-container.component';
import { StartingJourneyComponent } from './pages/starting-journey/starting-journey.component';
import { GuessSongContainerComponent } from './pages/guess-song-container/guess-song-container.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'introducing', component: IntroducingComponent },
  { path: 'puzzle', component: PuzzleContainerComponent },
  { path: 'reward', component: RewardComponent },
  { path: 'quest', component: QuestContainerComponent },
  { path: 'starting-journey', component: StartingJourneyComponent },
  { path: 'guess-song', component: GuessSongContainerComponent },
];