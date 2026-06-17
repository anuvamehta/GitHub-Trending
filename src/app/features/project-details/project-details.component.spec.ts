import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProjectDetailsComponent } from './project-details.component';
import { ApiService } from '../../core/services/api.service';
import { makeRepo } from '../../../testing/mock-repositories';

describe('ProjectDetailsComponent', () => {
  let component: ProjectDetailsComponent;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', ['getRepository']);
    apiServiceSpy.getRepository.and.returnValue(of(makeRepo()));

    TestBed.configureTestingModule({
      imports: [ProjectDetailsComponent],
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: apiServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ owner: 'facebook', repo: 'react' }) },
          },
        },
      ],
    });

    component = TestBed.createComponent(ProjectDetailsComponent).componentInstance;
  });

  describe('create', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('ngOnInit', () => {
    it('should request the repository from the route params', () => {
      apiServiceSpy.getRepository.and.returnValue(of(makeRepo()));

      component.ngOnInit();

      expect(apiServiceSpy.getRepository).toHaveBeenCalledOnceWith('facebook', 'react');
    });

    it('should expose the fetched repository on the component state', () => {
      const repo = makeRepo({ full_name: 'facebook/react', description: 'A declarative UI library.' });
      apiServiceSpy.getRepository.and.returnValue(of(repo));

      component.ngOnInit();

      expect(component.loading()).toBe(false);
      expect(component.error()).toBe(false);
      expect(component.repo()).toEqual(repo);
    });

    it('should flag an error when the request fails', () => {
      apiServiceSpy.getRepository.and.returnValue(throwError(() => new Error('fail')));

      component.ngOnInit();

      expect(component.error()).toBe(true);
      expect(component.loading()).toBe(false);
      expect(component.repo()).toBeNull();
    });
  });
});
