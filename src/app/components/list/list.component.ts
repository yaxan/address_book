import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// Importing core Angular functionalities, decorators, and services.

/**
 * ListComponent
 *
 * This component handles the presentation and interaction of a list of users. It includes functionalities such
 * as fetching user data from a service, pagination controls, and a search feature. It also integrates responsive
 * features by observing screen size breakpoints.
 */
@Component({
  selector: 'app-list', // The component's selector (custom HTML tag) for use in template files.
  templateUrl: './list.component.html', // The location of the component's template file.
  styleUrls: ['./list.component.scss'], // The location of the component's styles.
})
export class ListComponent implements OnInit {
  allUsers: User[] = []; // Storage for the complete list of users fetched from the service.
  users: User[] = []; // Storage for users that are displayed (filtered list, if search is active).
  displayedUsers: User[] = []; // Storage for users for the current page view (pagination).
  currentPage = 1; // Pagination control, representing the current page.
  pageSize = 10; // Pagination control, indicating the number of items per page.
  isLoading = true; // Flag indicating if user data is being loaded (for UI feedback).

  // Observables for screen size breakpoints, used to adjust the view for different screen sizes.
  isXSmall: Observable<boolean>;
  isSmall: Observable<boolean>;
  isMedium: Observable<boolean>;

  searchControl = new FormControl(); // Form control for the search input.

  /**
   * Constructs the ListComponent with necessary dependencies.
   *
   * @param userService Custom service for handling user-related operations.
   * @param breakpointObserver Service to reactively check the viewport against media query breakpoints.
   * @param router Service for navigating and URL manipulation capabilities.
   * @param cd Service that triggers change detection and updates the rendered component view.
   */
  constructor(
    private userService: UserService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {
    // Setting up responsive breakpoint observers for different screen sizes.
    // These observers help adjust UI elements based on the user's screen size.

    // Observer for extra small screens.
    this.isXSmall = this.breakpointObserver.observe(Breakpoints.XSmall).pipe(
      map((result) => result.matches), // Map the breakpoint result to a boolean value.
      shareReplay(), // Share and replay the last emitted value for new subscribers.
    );

    // Observer for small screens.
    this.isSmall = this.breakpointObserver.observe(Breakpoints.Small).pipe(
      map((result) => result.matches),
      shareReplay(),
    );

    // Observer for medium screens.
    this.isMedium = this.breakpointObserver.observe(Breakpoints.Medium).pipe(
      map((result) => result.matches),
      shareReplay(),
    );
  }

  /**
   * Angular's OnInit lifecycle hook.
   * Executes initialization logic after data-bound properties are initialized.
   */
  ngOnInit(): void {
    this.fetchUsers(); // Fetch the list of users on component initialization.
    this.initSearch(); // Initialize the search functionality.
  }

  /**
   * Navigates to the detailed view for a specific user.
   * @param user The user object containing detailed information.
   */
  viewDetails(user: User) {
    // Navigate to the details route with the user's unique identifier.
    this.router.navigate(['/details', user.login.uuid]);
  }

  /**
   * Updates the list of displayed users based on the current pagination state.
   */
  paginateUsers(): void {
    // Calculate the starting index of the current page.
    const startIndex = (this.currentPage - 1) * this.pageSize;

    // Slice the complete user list to get only the users for the current page.
    this.displayedUsers = this.users.slice(
      startIndex,
      startIndex + this.pageSize,
    );
  }

  /**
   * Fetches users from the UserService and handles loading states.
   */
  fetchUsers(): void {
    this.isLoading = true; // Set the loading state to true during data retrieval.

    // Subscribe to the user service to fetch user data.
    this.userService.fetchUsers().subscribe({
      next: (users) => {
        this.allUsers = users; // Populate the allUsers array with the fetched user data.
        this.users = [...this.allUsers]; // Initialize the current users array with all users.
        this.userService.setUsers(this.allUsers); // Share the user data with other components or services.

        this.currentPage = 1; // Reset pagination to the first page.
        this.paginateUsers(); // Update the list of displayed users.

        this.isLoading = false; // Data has been loaded, set the loading state to false.
      },
      error: (error) => {
        // Handle scenarios when fetching data fails.
        this.isLoading = false; // Set loading state to false, indicating completion of attempt.
        console.error('An error occurred when fetching users: ', error); // Log the error to the console.
      },
    });
  }

  // Pagination control: Advances to the next page of users.
  nextPage(): void {
    // Check if the end of the list has not been reached.
    if (this.currentPage * this.pageSize < this.allUsers.length) {
      this.currentPage++; // Advance to the next page.
      this.paginateUsers(); // Update the list of displayed users.
    }
  }

  // Pagination control: Returns to the previous page of users.
  prevPage(): void {
    // Check if the current page is not the first page.
    if (this.currentPage > 1) {
      this.currentPage--; // Go back to the previous page.
      this.paginateUsers(); // Update the list of displayed users.
    }
  }

  // Retrieves the current page number.
  getCurrentPage(): number {
    return this.currentPage;
  }

  // Gets total # of pages
  get totalPages(): number {
    return Math.ceil(this.users.length / this.pageSize);
  }

  // Checks if the current page is the last page
  get isLastPage(): boolean {
    return this.currentPage >= this.totalPages;
  }

  /**
   * Initializes the search functionality.
   * Listens for changes in the search input and filters the user list accordingly.
   */
  initSearch(): void {
    // Subscribe to the search control's value changes.
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Wait for the user to stop typing for 300ms.
        distinctUntilChanged(), // Only emit when the current search term is different from the last.
      )
      .subscribe((query) => {
        if (!query) {
          // If the search query is empty, reset the list to include all users.
          this.users = [...this.allUsers];
        } else {
          // If there's a search query, filter the user list based on the query.
          this.users = this.allUsers.filter((user) => {
            // Combine the user's first and last name.
            const fullName = user.name.first + ' ' + user.name.last;
            // Check if the combined name includes the search query (case-insensitive).
            return (
              fullName.toLowerCase().includes(query.toLowerCase()) ||
              user.email.toLowerCase().includes(query.toLowerCase()) ||
              user.phone.toLowerCase().includes(query.toLowerCase())
            );
          });
        }

        this.currentPage = 1; // Reset pagination to the first page due to new search results.
        this.paginateUsers(); // Update the list of displayed users.

        this.cd.detectChanges(); // Manually trigger a change detection cycle.
      });
  }
}
