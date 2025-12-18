import { Member } from './member';
import { Book } from './book';

export class Issue {
  issueId: number = 0;

  memberId!: number;        // 🔥 REQUIRED (FK)

  member!: Member | null;          // navigation (GET এ আসবে)

  issueDate: string = new Date().toISOString();
  returnDate?: string | null = null;

  isReturned: boolean = false;

  books: Book[] = [];
}
