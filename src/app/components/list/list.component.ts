import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-list',
  template: `
    <h2>Users</h2>
    <ul>
      <li *ngFor="let user of users">
        <a [routerLink]="['/details', user.login.uuid]">
          {{ user.name.first }} {{ user.name.last }}
        </a>
      </li>
    </ul>
    <div>
      <button (click)="prevPage()" [disabled]="currentPage === 1">Prev</button>
      <span>{{ currentPage }}</span>
      <button (click)="nextPage()">Next</button>
    </div>
  `,
})
export class ListComponent implements OnInit {
  users: User[] = [];
  currentPage = 1;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.fetchUsers(this.currentPage).subscribe(data => {
      this.users = data.results;
      this.userService.setUsers(this.users);
    });
  }

  nextPage(): void {
    this.currentPage++;
    this.fetchUsers();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchUsers();
    }
  }

  getCurrentPage(): number {
    return this.currentPage;
  }
}