// src/app/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://randomuser.me/api/?results=10&seed=nuvalence';
  private users: User[] = [];

  constructor(private http: HttpClient) {}

  fetchUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  setUsers(users: User[]): void {
    this.users = users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find(user => user.login.uuid === id);
  }
}
