import { Component, OnInit, signal, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IssueRepository } from '../../services/issue-repository';
import { ImageUpload } from '../../services/image-upload';
import { Issue } from '../../models/issue';
import { Member } from '../../models/member';
import { Book } from '../../models/book';

@Component({
  selector: 'app-issue-edit',
  templateUrl: './issue-edit.html',
  styleUrls: ['./issue-edit.css'],
  standalone: false,
})
export class IssueEdit implements OnInit {
  model = signal<Issue>(new Issue());
  uploading = false;
  loading = true;
  imageUpload = signal<ImageUpload | null>(null);

  // Available books for dropdown
  availableBooks: Book[] = [
    { bookId: 1, title: 'the sharlok homes', author: 'Arthar kunn', category: 'detective' },
    { bookId: 2, title: 'pro angular', author: 'nuru', category: 'programming' },
    { bookId: 3, title: 'agradut bangla', author: 'akm chowdhuray', category: 'bangla' }
  ];

  constructor(
    private repo: IssueRepository,
    private router: Router,
    private route: ActivatedRoute,
    upload: ImageUpload
  ) {
    this.imageUpload.set(upload);
  }

  ngOnInit(): void {
    this.model().member = new Member();
    this.model().books = [];

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.repo.getIssue(id).subscribe({
        next: (issue: any) => {
          setTimeout(() => {
            if (issue.issueDate) issue.issueDate = issue.issueDate.split('T')[0];
            if (issue.returnDate) issue.returnDate = issue.returnDate.split('T')[0];

            this.model.set(issue);
            this.model().member ??= new Member();
            this.model().books ??= [];

            // 🔹 Pre-fill author & category for existing books
            this.model().books.forEach(book => this.onBookTitleChange(book));

            this.loading = false;
          });
        },
        error: (err: any) => {
          console.error('Error loading issue:', err);
          alert('Failed to load issue data.');
          this.router.navigate(['/index']);
        },
      });
    } else {
      this.loading = false;
    }
  }

  addBook(): void {
    this.model().books.push({ bookId: 0, title: '', author: '', category: '' });
  }

  removeBook(index: number): void {
    this.model().books.splice(index, 1);
  }

  onBookTitleChange(book: Book): void {
    const selected = this.availableBooks.find(b => b.title === book.title);
    if (selected) {
      book.author = selected.author;
      book.category = selected.category;
    } else {
      book.author = '';
      book.category = '';
    }
  }

  async uploadImage(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (file.size > 200 * 1024) {
      alert('File size exceeds 200KB');
      return;
    }

    try {
      await this.imageUpload()?.getBase64(file);
    } catch (err) {
      console.error('Image preview failed', err);
      alert('Failed to read image');
    }
  }

  fileSelect = effect(() => {
    const member = this.model().member ?? new Member();
    this.model().member = member;

    const imageData = this.imageUpload()?.imageData();
    if (imageData) {
      member.photoPath = imageData;
    }
  });

  saveData(): void {
    if (!this.model().member?.memberName?.trim()) {
      alert('Member name is required');
      return;
    }

    if (!this.model().books?.length) {
      alert('At least one book is required');
      return;
    }

    for (const b of this.model().books) {
      if (!b.title?.trim()) {
        alert('Each book must have a title');
        return;
      }
    }

    const updatedModel = { ...this.model() };
    if (updatedModel.issueDate) {
      updatedModel.issueDate = new Date(updatedModel.issueDate).toISOString();
    }
    if (updatedModel.returnDate) {
      updatedModel.returnDate = new Date(updatedModel.returnDate).toISOString();
    }

    this.repo.UpdateIssue(updatedModel).subscribe({
      next: () => {
        alert('Issue updated successfully!');
        this.router.navigate(['/index']);
      },
      error: (err: any) => {
        console.error('Error updating issue', err);
        alert('Validation failed. Check console.');
      },
    });
  }

  goToIndex(): void {
    this.router.navigate(['/index']);
  }
}
