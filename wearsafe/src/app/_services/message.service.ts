import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FireDBMessage, Message } from '../types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  get(){
    return this.http.get<FireDBMessage[]>(`${environment.apiUrl}/messages.json`);
  }

  getNextId(){
    return this.http.get<any>(`${environment.apiUrl}/messages.json?orderBy="id"&limitToLast=1`);
  }

  post(message: any){
    return this.http.post<Message>(`${environment.apiUrl}/messages.json`,message);
  }

  async delete(id: number){
    return this.http.delete<Message>(`${environment.apiUrl}/messages/${id}.json`).toPromise();
  }
}
