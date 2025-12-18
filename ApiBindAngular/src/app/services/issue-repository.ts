import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Issue } from '../models/issue';

@Injectable({
  providedIn: 'root',
})
export class IssueRepository {
  apiPath: string = 'http://localhost:5000/api/issues';

  http: HttpClient = inject(HttpClient);


  getIssues() {
    return this.http.get<Issue[]>(this.apiPath);
  }
  PostIssue(issues: Issue) {
    console.log(issues);
    return this.http.post<Issue>(this.apiPath, issues);
  }
  getIssue(id: number) {
    return this.http.get<Issue>(this.apiPath + "/" + id)
  }
  UpdateIssue(model: Issue) {
    return this.http.put<Issue>(this.apiPath + "/" + model.issueId, model)
  }
  RemoveIssue(id: number) {
    return this.http.delete<Issue>(this.apiPath + "/" + id)
  }


}
