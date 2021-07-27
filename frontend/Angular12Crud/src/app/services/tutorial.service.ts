import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tutorial } from '../models/tutorial.model';

const baseUrl = '/api';

@Injectable({
  providedIn: 'root',
})
export class TutorialService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(baseUrl);
  }

  getPm2List(): Observable<any> {
    return this.http.get(baseUrl + '/getpm2list');
  }

  appRestart(data: any): Observable<any> {
    return this.http.post(baseUrl + '/apprestart', data);
  }

  appStop(data: any): Observable<any> {
    return this.http.post(baseUrl + '/appstop', data);
  }

  appDelete(data: any): Observable<any> {
    return this.http.delete(baseUrl + '/appdelete/' + data.id);
  }

  appOutlog(data: any): Observable<any> {
    return this.http.get(baseUrl + '/getoutlog/' + data.id);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByTitle(title: any): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(`${baseUrl}?title=${title}`);
  }
}
