import { Component, signal } from '@angular/core';
import { IssueRepository } from '../../services/issue-repository';
import { Issue } from '../../models/issue';

@Component({
  selector: 'app-issue-index',
  templateUrl: './issue-index.html',
  styleUrls: ['./issue-index.css'],
  standalone:false
})
export class IssueIndex {
  issues = signal<Issue[]>([]);

  constructor(private repo: IssueRepository) {
    this.loadData();
  }

  // Load all issues from API
  loadData() {
    this.repo.getIssues().subscribe({
      next: (result: Issue[]) => this.issues.set(result),
      error: (err: any) => console.error('Error fetching issues:', err),
    });
  }

  // Delete an issue
  deleteIssue(id: number) {
    if (!confirm('Are you sure you want to delete this issue?')) return;

    this.repo.RemoveIssue(id).subscribe({
      next: () => {
        alert('Issue deleted successfully!');
        this.issues.update(list => list.filter(i => i.issueId !== id));
      },
      error: (err: any) => {
        alert('Error deleting issue.');
        console.error('Delete error:', err);
      },
    });
  }

  // trackBy function for ngFor
  trackById(index: number, item: Issue) {
    return item.issueId;
  }
}


