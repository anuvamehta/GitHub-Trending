import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProjectDetailsComponent } from './project-details.component';
import { GithubService } from '../../core/services/github.service';
import { makeRepo } from '../../../testing/mock-repositories';

describe('ProjectDetailsComponent', () => {
  let component: ProjectDetailsComponent;
  let githubServiceSpy: jasmine.SpyObj<GithubService>;

  beforeEach(() => {
    githubServiceSpy = jasmine.createSpyObj<GithubService>('GithubService', ['getRepository']);
    githubServiceSpy.getRepository.and.returnValue(of(makeRepo()));

    TestBed.configureTestingModule({
      imports: [ProjectDetailsComponent],
      providers: [
        provideRouter([]),
        { provide: GithubService, useValue: githubServiceSpy },
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
      githubServiceSpy.getRepository.and.returnValue(of(makeRepo()));

      component.ngOnInit();

      expect(githubServiceSpy.getRepository).toHaveBeenCalledOnceWith('facebook', 'react');
    });

    it('should expose the fetched repository on the component state', () => {
      const repo = makeRepo({ full_name: 'facebook/react', description: 'A declarative UI library.' });
      githubServiceSpy.getRepository.and.returnValue(of(repo));

      component.ngOnInit();

      expect(component.loading()).toBe(false);
      expect(component.error()).toBe(false);
      expect(component.repo()).toEqual(repo);
    });

    it('should flag an error when the request fails', () => {
      githubServiceSpy.getRepository.and.returnValue(throwError(() => new Error('fail')));

      component.ngOnInit();

      expect(component.error()).toBe(true);
      expect(component.loading()).toBe(false);
      expect(component.repo()).toBeNull();
    });
  });
});
