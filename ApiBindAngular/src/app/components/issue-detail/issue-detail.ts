import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IssueRepository } from '../../services/issue-repository';
import { Issue } from '../../models/issue';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.html',
  styleUrls: ['./issue-detail.css'],
  standalone: false
})
export class IssueDetail implements OnInit {
  issue = signal<Issue | null>(null);
  loading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private repo: IssueRepository
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.errorMessage.set('Invalid issue ID');
      this.loading.set(false);
      return;
    }

    this.repo.getIssue(id).subscribe({
      next: (data: Issue) => {
        this.issue.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading issue:', err);
        this.errorMessage.set('Failed to load issue details');
        this.loading.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['/index']);
  }
}
