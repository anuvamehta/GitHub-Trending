import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { Repository } from '../models/repository.model';

interface SearchResponse {
  items: Repository[];
}

export type SortOption = 'stars' | 'forks';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  // Cached per sort option so revisiting the dashboard does not re-fetch the list.
  private trendingCache = new Map<SortOption, Observable<Repository[]>>();

  getTrendingRepositories(sort: SortOption = 'stars'): Observable<Repository[]> {
    if (!this.trendingCache.has(sort)) {
      const url = `https://api.github.com/search/repositories?q=stars:>10000&sort=${sort}&order=desc&per_page=20`;
      const request$ = this.http.get<SearchResponse>(url).pipe(
        map((res) => res.items),
        shareReplay(1),
      );
      this.trendingCache.set(sort, request$);
    }
    return this.trendingCache.get(sort)!;
  }

  searchRepositories(name: string, sort: SortOption = 'stars'): Observable<Repository[]> {
    const query = encodeURIComponent(`${name} in:name`);
    const url = `https://api.github.com/search/repositories?q=${query}&sort=${sort}&order=desc&per_page=20`;
    return this.http.get<SearchResponse>(url).pipe(map((res) => res.items));
  }

  getRepository(owner: string, repo: string): Observable<Repository> {
    return this.http.get<Repository>(`https://api.github.com/repos/${owner}/${repo}`);
  }
}
