
import { Issue } from "./issue";
export class Member {
  memberId: number = 0;
  memberName: string = "";
  mobile?: string = "";
  address?: string = "";
  photoPath?: string;     // nullable image url
  issues: Issue[] = [];   // initialize as empty arra
}
