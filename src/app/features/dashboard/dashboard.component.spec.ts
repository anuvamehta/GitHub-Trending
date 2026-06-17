import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { ApiService } from '../../core/services/api.service';
import { makeRepo } from '../../../testing/mock-repositories';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', [
      'getTrendingRepositories',
      'searchRepositories',
    ]);
    apiServiceSpy.getTrendingRepositories.and.returnValue(of([makeRepo({ id: 1, name: 'react' })]));
    apiServiceSpy.searchRepositories.and.returnValue(of([makeRepo({ name: 'angular' })]));

    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        {
          provide: ApiService,
          useValue: apiServiceSpy,
        },
      ],
    });

    component = TestBed.createComponent(DashboardComponent).componentInstance;
  });

  describe('should create', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('ngOnInit', () => {
    it('should request trending repositories on init', () => {
      apiServiceSpy.getTrendingRepositories.and.returnValue(of([makeRepo({ id: 1, name: 'react' })]));

      component.ngOnInit();

      expect(apiServiceSpy.getTrendingRepositories).toHaveBeenCalledOnceWith('stars');
      expect(apiServiceSpy.searchRepositories).not.toHaveBeenCalled();
    });

    it('should expose the fetched repositories on the component state', () => {
      const trending = [makeRepo({ id: 1, name: 'react' }), makeRepo({ id: 2, name: 'vue' })];
      apiServiceSpy.getTrendingRepositories.and.returnValue(of(trending));

      component.ngOnInit();

      expect(component.loading()).toBe(false);
      expect(component.error()).toBe(false);
      expect(component.repositories()).toEqual(trending);
    });

    it('should flag an error when loading fails', () => {
      apiServiceSpy.getTrendingRepositories.and.returnValue(throwError(() => new Error('boom')));

      component.ngOnInit();

      expect(component.error()).toBe(true);
      expect(component.loading()).toBe(false);
    });
  });

  describe('onType', () => {
    it('should debounce rapid typing into a single search request', fakeAsync(() => {
      const result = [makeRepo({ name: 'angular' })];
      apiServiceSpy.searchRepositories.and.returnValue(of(result));
      component.ngOnInit();

      component.onType('a');
      component.onType('an');
      component.onType('ang');
      tick(400);

      expect(component.query()).toBe('ang');
      expect(apiServiceSpy.searchRepositories).toHaveBeenCalledOnceWith('ang', 'stars');
      expect(component.repositories()).toEqual(result);
    }));
  });

  describe('onSearch', () => {
    it('should search immediately when the form is submitted', fakeAsync(() => {
      const result = [makeRepo({ name: 'angular' })];
      apiServiceSpy.searchRepositories.and.returnValue(of(result));
      component.ngOnInit();
      component.onType('angular');

      component.onSearch(new Event('submit'));

      expect(apiServiceSpy.searchRepositories).toHaveBeenCalledWith('angular', 'stars');
      expect(component.repositories()).toEqual(result);
      tick(400);
    }));
  });

  describe('onSortChange', () => {
    it('should reload trending repositories sorted by the selected option', () => {
      apiServiceSpy.getTrendingRepositories.and.returnValue(of([makeRepo({ name: 'react' })]));
      component.ngOnInit();

      component.onSortChange('forks');

      expect(component.sort()).toBe('forks');
      expect(apiServiceSpy.getTrendingRepositories).toHaveBeenCalledWith('forks');
    });
  });
});
