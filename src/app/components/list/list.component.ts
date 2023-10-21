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
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  users: User[] = [];
  currentPage = 1;
  isLoading = true;
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
    this.isLoading = true;
    this.userService.fetchUsers(this.currentPage).subscribe(data => {
      this.users = data.results;
      this.userService.setUsers(this.users);
      this.isLoading = false;
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