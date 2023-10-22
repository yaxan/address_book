import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  allUsers: User[] = [];
  users: User[] = [];
  displayedUsers: User[] = [];
  currentPage = 1;
  pageSize = 10;
  isLoading = true;
  isXSmall: Observable<boolean>;
  isSmall: Observable<boolean>;
  isMedium: Observable<boolean>;
  searchControl = new FormControl();

  constructor(
    private userService: UserService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {
    this.isXSmall = this.breakpointObserver.observe(Breakpoints.XSmall).pipe(
      map((result) => result.matches),
      shareReplay(),
    );

    this.isSmall = this.breakpointObserver.observe(Breakpoints.Small).pipe(
      map((result) => result.matches),
      shareReplay(),
    );

    this.isMedium = this.breakpointObserver.observe(Breakpoints.Medium).pipe(
      map((result) => result.matches),
      shareReplay(),
    );
  }

  ngOnInit(): void {
    this.fetchUsers();
    this.initSearch();
  }

  viewDetails(user: User) {
    this.router.navigate(['/details', user.login.uuid]);
  }

  paginateUsers(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.displayedUsers = [
      ...this.users.slice(startIndex, startIndex + this.pageSize),
    ];
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.userService.fetchUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
        this.users = [...this.allUsers];
        this.userService.setUsers(this.allUsers);

        this.currentPage = 1;
        this.paginateUsers();

        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('An error occurred when fetching users: ', error);
      },
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

  initSearch(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        if (!query) {
          this.users = [...this.allUsers];
        } else {
          this.users = this.allUsers.filter((user) => {
            const fullName = user.name.first + ' ' + user.name.last;
            return fullName.toLowerCase().includes(query.toLowerCase());
          });
        }

        this.currentPage = 1;
        this.paginateUsers();

        this.cd.detectChanges();
      });
  }
}
