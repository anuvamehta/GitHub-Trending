import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BookmarkService } from '../../core/services/bookmark.service';
import { RepositoryCardComponent } from '../../shared/repository-card/repository-card.component';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [RepositoryCardComponent],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarksComponent {
  private bookmarks = inject(BookmarkService);

  repositories = this.bookmarks.bookmarks;
}
