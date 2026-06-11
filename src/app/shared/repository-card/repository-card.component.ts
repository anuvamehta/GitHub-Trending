import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { Repository } from '../../core/models/repository.model';
import { BookmarkService } from '../../core/services/bookmark.service';

@Component({
  selector: 'app-repository-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe, MatIconModule],
  templateUrl: './repository-card.component.html',
  styleUrl: './repository-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepositoryCardComponent {
  private bookmarks = inject(BookmarkService);

  repo = input.required<Repository>();

  bookmarked = computed(() => this.bookmarks.isBookmarked(this.repo().id));

  toggleBookmark(): void {
    this.bookmarks.toggle(this.repo());
  }
}
