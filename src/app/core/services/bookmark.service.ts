import { computed, Injectable, signal } from '@angular/core';
import { Repository } from '../models/repository.model';

const STORAGE_KEY = 'github-trending-bookmarks';

@Injectable({ providedIn: 'root' })
export class BookmarkService {
  private state = signal<Repository[]>(this.read());

  readonly bookmarks = this.state.asReadonly();
  readonly count = computed(() => this.state().length);

  isBookmarked(id: number): boolean {
    return this.state().some((repo) => repo.id === id);
  }

  toggle(repo: Repository): void {
    const next = this.isBookmarked(repo.id)
      ? this.state().filter((item) => item.id !== repo.id)
      : [...this.state(), repo];

    this.state.set(next);
    this.write(next);
  }

  private read(): Repository[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Repository[]) : [];
    } catch {
      return [];
    }
  }

  private write(bookmarks: Repository[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }
}
