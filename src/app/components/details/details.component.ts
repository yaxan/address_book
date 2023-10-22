import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

/**
 * Component decorator providing metadata for DetailsComponent.
 */
@Component({
  selector: 'app-details', // Component's tag for use in templates
  templateUrl: './details.component.html', // Layout file for this component's view
  styleUrls: ['./details.component.scss'], // Styles file for this component
})
/**
 * 'DetailsComponent' manages the detailed view of a user entity.
 */
export class DetailsComponent implements OnInit {
  user?: User; // Property holding the user's data, initially undefined until data is fetched.

  /**
   * Constructs the DetailsComponent with necessary services injected.
   *
   * @param route Service that contains route specific information.
   * @param userService Custom service for handling user-related operations.
   * @param router Service for navigation and URL manipulation capabilities.
   */
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
  ) {}

  /**
   * OnInit lifecycle hook to initialize component data.
   * Fetches the user details based on the 'id' retrieved from the route parameters.
   */
  ngOnInit(): void {
    // Retrieve the 'id' from the current route's parameter map
    const id = this.route.snapshot.paramMap.get('id');

    // Check if 'id' is present in the route
    if (id) {
      // Use UserService to fetch the user details corresponding to 'id'
      this.user = this.userService.getUserById(id);
    }
    // Optional: handle 'else' case if 'id' is not available
  }

  /**
   * Handles the action to navigate back to the home page.
   */
  goBack(): void {
    // Use Router service for navigating to the home view
    this.router.navigate(['/']);
  }
}
