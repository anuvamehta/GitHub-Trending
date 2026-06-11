import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { GithubService } from '../../core/services/github.service';
import { makeRepo } from '../../../testing/mock-repositories';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let githubServiceSpy: jasmine.SpyObj<GithubService>;

  beforeEach(() => {
    githubServiceSpy = jasmine.createSpyObj<GithubService>('GithubService', [
      'getTrendingRepos',
      'searchRepositories',
    ]);
    githubServiceSpy.getTrendingRepos.and.returnValue(of([makeRepo({ id: 1, name: 'react' })]));
    githubServiceSpy.searchRepositories.and.returnValue(of([makeRepo({ name: 'angular' })]));

    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        {
          provide: GithubService,
          useValue: githubServiceSpy,
        },
      ],
    });

    component = TestBed.createComponent(DashboardComponent).componentInstance;
  });

  describe('"create"', () => {
    it('should create the component', () => {
      // Arrange & Act & Assert
      expect(component).toBeTruthy();
    });
  });

  describe('"ngOnInit"', () => {
    it('should request trending repositories on init', () => {
      // Arrange
      githubServiceSpy.getTrendingRepos.and.returnValue(of([makeRepo({ id: 1, name: 'react' })]));

      // Act
      component.ngOnInit();

      // Assert
      expect(githubServiceSpy.getTrendingRepos).toHaveBeenCalledOnceWith('stars');
      expect(githubServiceSpy.searchRepositories).not.toHaveBeenCalled();
    });

    it('should expose the fetched repositories on the component state', () => {
      // Arrange
      const trending = [makeRepo({ id: 1, name: 'react' }), makeRepo({ id: 2, name: 'vue' })];
      githubServiceSpy.getTrendingRepos.and.returnValue(of(trending));

      // Act
      component.ngOnInit();

      // Assert
      expect(component.loading()).toBe(false);
      expect(component.error()).toBe(false);
      expect(component.repositories()).toEqual(trending);
    });

    it('should flag an error when loading fails', () => {
      // Arrange
      githubServiceSpy.getTrendingRepos.and.returnValue(throwError(() => new Error('boom')));

      // Act
      component.ngOnInit();

      // Assert
      expect(component.error()).toBe(true);
      expect(component.loading()).toBe(false);
    });
  });

  describe('"onType"', () => {
    it('should debounce rapid typing into a single search request', fakeAsync(() => {
      // Arrange
      const result = [makeRepo({ name: 'angular' })];
      githubServiceSpy.searchRepositories.and.returnValue(of(result));
      component.ngOnInit();

      // Act
      component.onType('a');
      component.onType('an');
      component.onType('ang');
      tick(400);

      // Assert
      expect(component.query()).toBe('ang');
      expect(githubServiceSpy.searchRepositories).toHaveBeenCalledOnceWith('ang', 'stars');
      expect(component.repositories()).toEqual(result);
    }));
  });

  describe('"onSearch"', () => {
    it('should search immediately when the form is submitted', fakeAsync(() => {
      // Arrange
      const result = [makeRepo({ name: 'angular' })];
      githubServiceSpy.searchRepositories.and.returnValue(of(result));
      component.ngOnInit();
      component.onType('angular');

      // Act
      component.onSearch(new Event('submit'));

      // Assert
      expect(githubServiceSpy.searchRepositories).toHaveBeenCalledWith('angular', 'stars');
      expect(component.repositories()).toEqual(result);
      tick(400);
    }));
  });

  describe('"onSortChange"', () => {
    it('should reload trending repositories sorted by the selected option', () => {
      // Arrange
      githubServiceSpy.getTrendingRepos.and.returnValue(of([makeRepo({ name: 'react' })]));
      component.ngOnInit();

      // Act
      component.onSortChange('forks');

      // Assert
      expect(component.sort()).toBe('forks');
      expect(githubServiceSpy.getTrendingRepos).toHaveBeenCalledWith('forks');
    });
  });
});
