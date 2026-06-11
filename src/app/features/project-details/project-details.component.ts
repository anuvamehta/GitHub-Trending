import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GithubService } from '../../core/services/github.service';
import { Repository } from '../../core/models/repository.model';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [RouterLink, DecimalPipe, MatIconModule],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private github = inject(GithubService);

  repo = signal<Repository | null>(null);
  loading = signal(true);
  error = signal(false);

  ngOnInit(): void {
    const owner = this.route.snapshot.paramMap.get('owner')!;
    const name = this.route.snapshot.paramMap.get('repo')!;

    this.github.getRepository(owner, name).subscribe({
      next: (data) => {
        this.repo.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
