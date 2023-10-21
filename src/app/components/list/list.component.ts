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
  displayedUsers: User[] = []; // This will only hold the users for the current page
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
    this.userService.fetchUsers().subscribe(
      (users) => {
        this.allUsers = users;
        this.users = [...this.allUsers]; // Ensure 'users' also has the initial full set
        this.userService.setUsers(this.allUsers); // If you still need to store them in local storage

        // Now, prepare the initial page of users for display
        this.currentPage = 1; // Start from the first page
        this.paginateUsers(); // This will slice the first page of users and put them in 'displayedUsers'

        this.isLoading = false; // Loading is done
      },
      (error) => {
        this.isLoading = false; // Even on error, loading should stop
        console.error('An error occurred when fetching users: ', error);
      },
    );
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
          this.users = [...this.allUsers]; // if there's no query, the full list is considered
        } else {
          // if there's a query, we filter the allUsers list
          this.users = this.allUsers.filter((user) => {
            const fullName = user.name.first + ' ' + user.name.last;
            return fullName.toLowerCase().includes(query.toLowerCase());
          });
        }

        // Regardless of the above, we now have a 'users' list we want to paginate
        this.currentPage = 1;
        this.paginateUsers();

        // Since we changed what's being displayed, we need Angular to check the view
        this.cd.detectChanges();
      });
  }
}
