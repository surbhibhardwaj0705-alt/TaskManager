import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root',
})
export class Task {

  private apiUrl ="http://localhost:5000/api/tasks";

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  
  getHeaders(){
     const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : '';
   console.log('Token:', localStorage.getItem('token'));

  return {
    headers: new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    })
  };
}

  getTasks(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  addTask(task: any): Observable<any> {
    return this.http.post(this.apiUrl, task, this.getHeaders());
  }

  updateTask(id: string, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`,
      task,
      this.getHeaders()
    );
  }
  
  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`,
      this.getHeaders()
    );
  }
  markCompleted(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/complete`, {}, this.getHeaders());
  }

}
