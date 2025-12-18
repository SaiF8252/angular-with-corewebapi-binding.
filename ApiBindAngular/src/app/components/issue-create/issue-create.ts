import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Issue } from '../../models/issue';
import { Member } from '../../models/member';
import { Book } from '../../models/book';
import { IssueRepository } from '../../services/issue-repository';
import { ImageUpload } from '../../services/image-upload';
import { ValidationHelper } from '../../services/validation-helper';

@Component({
  selector: 'app-issue-create',
  templateUrl: './issue-create.html',
  styleUrls: ['./issue-create.css'],
  standalone: false,
})
export class IssueCreate implements OnInit {
  model: Issue = new Issue();
  uploading = false;

  // Available books for dropdown
  availableBooks: Book[] = [
    { bookId: 1, title: 'the sharlok homes', author: 'Arthar kunn', category: 'detective' },
    { bookId: 2, title: 'pro angular', author: 'nuru ', category: 'programming' },
    { bookId: 3, title: 'agradut bangla', author: 'akm chowdhuray', category: 'bangla' }
  ];

  constructor(
    private repo: IssueRepository,
    private router: Router,
    private imageUpload: ImageUpload,
    public ValidationHelper: ValidationHelper
  ) { }

  ngOnInit(): void {
    this.model.member ??= new Member();
    this.model.books ??= [];
    if (!this.model.issueDate) {
      const today = new Date();
      this.model.issueDate = today.toISOString().split('T')[0];
    }
    if (!this.model.returnDate) {
      this.model.returnDate = '';
    }
  }

  addBook(): void {
    this.model.books.push({ bookId: 0, title: '', author: '', category: '' });
  }

  removeBook(index: number): void {
    this.model.books.splice(index, 1);
  }

  // Update author and category when book title changes
  onBookTitleChange(book: Book): void {
    const selected = this.availableBooks.find(b => b.title === book.title);
    if (selected) {
      book.author = selected.author;
      book.category = selected.category;
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
      await this.imageUpload.getBase64(file);
      this.model.member ??= new Member();
      this.model.member.photoPath = this.imageUpload.imageData();
    } catch (err) {
      console.error('Image preview failed', err);
      alert('Failed to read image');
    }
  }

  saveData(): void {
    if (this.model.returnDate === '') {
      this.model.returnDate = null;
    }

    if (!this.model.member?.memberName?.trim()) {
      alert('Member name is required');
      return;
    }

    if (!this.model.books?.length) {
      alert('At least one book is required');
      return;
    }

    for (const b of this.model.books) {
      if (!b.title?.trim()) {
        alert('Each book must have a title');
        return;
      }
    }

    this.repo.PostIssue(this.model).subscribe({
      next: () => this.router.navigate(['/index']),
      error: (err: any) => {
        console.error('Error saving issue', err);
        alert('Validation failed. Check console.');
      }
    });
  }

  goToIndex(): void {
    this.router.navigate(['/index']);
  }
}
