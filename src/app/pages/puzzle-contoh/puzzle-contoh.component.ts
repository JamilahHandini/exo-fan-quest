import { Component, AfterViewInit } from '@angular/core';
import Sortable from 'sortablejs';

@Component({
  selector: 'app-puzzle-contoh',
  standalone: true,
  templateUrl: './puzzle-contoh.component.html',
  styleUrls: ['./puzzle-contoh.component.css'],
})
export class PuzzleContohComponent implements AfterViewInit {

ngAfterViewInit(): void {
    const pieces = document.getElementById('pieces');
    const slots = document.getElementById('slots');

    if (pieces) {
      Sortable.create(pieces, {
        group: 'puzzle',
        animation: 150,
      });
    }

    if (slots) {
      Sortable.create(slots, {
        group: 'puzzle',
        animation: 150,
        onAdd: (evt) => {
          // Pastikan evt.to dan evt.newIndex ada
          const to = evt.to;
          const index = evt.newIndex;

          if (!to || index === undefined) return; // keluar jika undefined

          const targetSlot = to.children.item(index) as HTMLElement; // lebih aman pakai .item()
          const piece = evt.item as HTMLElement;

          if (targetSlot) {
            targetSlot.innerHTML = '';
            targetSlot.appendChild(piece);
          }
        }
      });
    }
  }

}
