import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RepositoryCardComponent } from './repository-card.component';
import { BookmarkService } from '../../core/services/bookmark.service';
import { makeRepo } from '../../../testing/mock-repositories';

describe('RepositoryCardComponent', () => {
  let fixture: ComponentFixture<RepositoryCardComponent>;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [RepositoryCardComponent],
      providers: [provideRouter([])],
    });

    fixture = TestBed.createComponent(RepositoryCardComponent);
    fixture.componentRef.setInput('repo', makeRepo({ id: 1, name: 'react' }));
    fixture.detectChanges();
  });

  it('should toggle the bookmark and persist it', () => {
    const bookmarks = TestBed.inject(BookmarkService);
    const button = fixture.nativeElement.querySelector(
      '[data-testid="bookmark-button"]',
    ) as HTMLButtonElement;
    const icon = button.querySelector('.bookmark-icon') as HTMLElement;

    button.click();
    fixture.detectChanges();

    expect(bookmarks.isBookmarked(1)).toBe(true);
    expect(icon.textContent?.trim()).toBe('bookmark');
  });
});
