import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  allUsers: User[] = [];
  users: User[] = [];
  currentPage = 1;
  pageSize = 10; // Number of items per page
  isLoading = true;
  isXSmall: Observable<boolean>;
  isSmall: Observable<boolean>;

  constructor(
    private userService: UserService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
  ) {
    this.isXSmall = this.breakpointObserver.observe(Breakpoints.XSmall).pipe(
      map((result) => result.matches),
      shareReplay(),
    );

    this.isSmall = this.breakpointObserver.observe(Breakpoints.Small).pipe(
      map((result) => result.matches),
      shareReplay(),
    );
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  viewDetails(user: User) {
    this.router.navigate(['/details', user.login.uuid]);
  }

  paginateUsers(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.users = this.allUsers.slice(startIndex, startIndex + this.pageSize);
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.userService.fetchUsers().subscribe((users) => {
      this.allUsers = users;
      this.userService.setUsers(this.allUsers); // If you still need to store them in local storage
      this.paginateUsers();
      this.isLoading = false;
    });
  }

  nextPage(): void {
    if (this.currentPage * this.pageSize < this.allUsers.length) {
      this.currentPage++;
      this.paginateUsers();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateUsers();
    }
  }

  getCurrentPage(): number {
    return this.currentPage;
  }
}
