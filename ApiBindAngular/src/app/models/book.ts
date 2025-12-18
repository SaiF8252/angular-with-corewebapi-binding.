import { Issue } from "./issue";

export class Book {
  bookId: number = 0;
  title: string = "";
  author: string = "";
  category?: string;

  issueId?: number;   // FK
  issue?: Issue;      // single issue
}
