// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://randomuser.me/api/?seed=nuvalence';
  private usersCache: User[] | null = null;

  constructor(private http: HttpClient) {}

  fetchUsers(): Observable<User[]> {
    if (this.usersCache) {
      return of(this.usersCache);
    }

    const url = `${this.apiUrl}&results=50`;
    return this.http.get<any>(url).pipe(
      tap((data: { results: User[] | null; }) => {
        this.usersCache = data.results;
      }),
      map(data => data.results as User[])
    );
  }

  setUsers(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  getUsers(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  getUserById(id: string): User | undefined {
    const users = this.getUsers();
    return users.find(user => user.login.uuid === id);
  }
}