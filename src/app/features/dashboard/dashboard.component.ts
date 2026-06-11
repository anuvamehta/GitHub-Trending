import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, map, merge, Observable, Subject, switchMap, tap} from 'rxjs';
import { GithubService, SortOption } from '../../core/services/github.service';
import { Repository } from '../../core/models/repository.model';
import { RepositoryCardComponent } from '../../shared/repository-card/repository-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RepositoryCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private github = inject(GithubService);

  repositories = signal<Repository[]>([]);
  loading = signal(true);
  error = signal(false);
  query = signal('');
  sort = signal<SortOption>('stars');

  private typed$ = new Subject<string>();
  private submitted$ = new Subject<string>();

  constructor() {
    merge(
      this.typed$.pipe(debounceTime(400), distinctUntilChanged()),
      this.submitted$,
    )
      .pipe(
        map((term) => term.trim()),
        tap(() => {
          this.loading.set(true);
          this.error.set(false);
        }),
        switchMap((term) => this.fetch(term)),
        takeUntilDestroyed(),
      )
      .subscribe((repos) => {
        this.repositories.set(repos);
        this.loading.set(false);
      });
  }

  ngOnInit(): void {
    this.submitted$.next('');
  }

  onType(value: string): void {
    this.query.set(value);
    this.typed$.next(value);
  }

  onSearch(event: Event): void {
    event.preventDefault();
    this.submitted$.next(this.query());
  }

  onSortChange(value: string): void {
    this.sort.set(value as SortOption);
    this.submitted$.next(this.query());
  }

  private fetch(term: string): Observable<Repository[]> {
    const sort = this.sort();
    const request$ = term
      ? this.github.searchRepositories(term, sort)
      : this.github.getTrendingRepos(sort);

    return request$.pipe(
      catchError(() => {
        this.error.set(true);
        this.loading.set(false);
        return EMPTY;
      }),
    );
  }
}
