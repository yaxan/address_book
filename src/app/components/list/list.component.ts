import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  template: `
    <div class="container" fxLayout="column" fxLayoutAlign="center center" fxFlexFill>
      <mat-card class="list">
      <mat-grid-list cols="3" rowHeight="2:1" gutterSize="12px" [cols]="(isXSmall | async) ? 1 : (isSmall | async) ? 2 : 3">
        <mat-grid-tile *ngFor="let user of users" class="user-card">
          <!-- Use a div with a click event to make the tile clickable -->
          <div (click)="viewDetails(user)" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px" class="clickable-tile">
            <div class="user-initials">
              {{ user.name.first[0] }}{{ user.name.last[0] }}
            </div>
            <div fxFlex fxLayout="column" fxLayoutAlign="start start" fxLayoutGap="10px">
              <h2>{{ user.name.first }} {{ user.name.last }}</h2>
              <p>{{ user.email }}</p>
            </div>
          </div>
        </mat-grid-tile>
      </mat-grid-list>
        <div class="pagination-container" fxLayout="row" fxLayoutAlign="space-between center">
          <button mat-flat-button color="primary" (click)="prevPage()" [disabled]="currentPage === 1">Prev</button>
          <div class="page-indicator">{{ currentPage }}</div>
          <button mat-flat-button color="primary" (click)="nextPage()">Next</button>
        </div>
      </mat-card>
    </div>
  `,
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  users: User[] = [];
  currentPage = 1;
  isXSmall: Observable<boolean>;
  isSmall: Observable<boolean>;

  constructor(private userService: UserService, private breakpointObserver: BreakpointObserver, private router: Router) {
    this.isXSmall = this.breakpointObserver.observe(Breakpoints.XSmall)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );

    this.isSmall = this.breakpointObserver.observe(Breakpoints.Small)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );

  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  viewDetails(user: any) {
    this.router.navigate(['/details', user.login.uuid]);
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