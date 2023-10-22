import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ListComponent } from './list.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { User } from '../../models/user.model';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

/**
 * ListComponent Tests
 *
 * This test suite performs unit testing for the ListComponent class. The ListComponent is responsible
 * for rendering a list of users and interacts with the UserService to fetch data. These tests focus
 * on verifying both the component creation and its interaction with UserService, ensuring it behaves
 * as expected under various circumstances typical to its operation.
 */
describe('ListComponent', () => {
  // Component instance to be tested.
  let component: ListComponent;

  // Fixture for testing the component instance.
  let fixture: ComponentFixture<ListComponent>;

  // Service used by the component to fetch user data.
  let userService: UserService;

  // Mock user data to simulate real user information returned from a service or API.
  // This mock data is used to isolate the component behavior from external dependencies and data variability.
  const mockUsers: User[] = [
    {
      login: { uuid: 'sample-uuid-1' },
      name: { title: 'ms', first: 'susan', last: 'doe' },
      phone: '123-456-7890',
      email: 'susan.doe@example.com',
      location: { city: 'city', state: 'state', country: 'country' },
      picture: {
        large: 'https://randomuser.me/api/portraits/men/75.jpg',
        medium: 'https://randomuser.me/api/portraits/med/men/75.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/75.jpg',
      },
    },
    {
      login: { uuid: 'sample-uuid-2' },
      name: { title: 'mr', first: 'john', last: 'doe' },
      phone: '123-456-7890',
      email: 'john.doe@example.com',
      location: { city: 'city', state: 'state', country: 'country' },
      picture: {
        large: 'https://randomuser.me/api/portraits/men/75.jpg',
        medium: 'https://randomuser.me/api/portraits/med/men/75.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/75.jpg',
      },
    },
  ];
  /**
   * Initial setup function called before each test runs.
   * It asynchronously initializes the testing environment, imports necessary modules,
   * and compiles the component.
   */
  beforeEach(async () => {
    // Configure a testing module environment for this suite.
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatCardModule,
        MatGridListModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      declarations: [ListComponent], // The component being tested.
      providers: [UserService], // The service being mocked for isolated testing.
    }).compileComponents(); // Compile the component's template and CSS.
  });

  /**
   * Setup function called before each individual test.
   * It creates a fresh component instance and fixture environment before each test to avoid
   * stateful collisions and side effects. It also establishes necessary mocks for dependent services.
   */
  beforeEach(() => {
    // Create a new component fixture instance.
    fixture = TestBed.createComponent(ListComponent);

    // Retrieve the component instance itself.
    component = fixture.componentInstance;

    // Retrieve an instance of UserService from the TestBed injector to ensure usage of the same
    // instance that the component uses, allowing for accurate interaction testing.
    userService = TestBed.inject(UserService);

    // Create a spy on the 'fetchUsers' method of userService. Instead of performing an actual HTTP
    // request, it will use our mock data, ensuring our tests are isolated from external APIs and fast.
    spyOn(userService, 'fetchUsers').and.returnValue(of(mockUsers));

    // Trigger a change detection cycle for the component. This initial run simulates the first
    // lifecycle hook (ngOnInit) and fetches the user list, populating the component's view.
    fixture.detectChanges();
  });

  /**
   * Test Case: Component Creation
   *
   * This test verifies that the ListComponent is created successfully. A successful creation indicates
   * that all required dependencies are satisfied and initial loading of data (if any) is performed correctly.
   */
  it('should create', () => {
    // The 'toBeTruthy' check confirms that the component instance is created and is not undefined or null.
    expect(component).toBeTruthy();
  });

  /**
   * Test Case: User Retrieval on Initialization
   *
   * This test checks whether the component, on initialization, retrieves user data using the UserService.
   * The expected behavior is that the 'fetchUsers' method of UserService is called and that the component's
   * 'users' property is populated with the data fetched (mocked for this test).
   */
  it('should retrieve users on init', () => {
    // Trigger the component's initialization logic.
    component.ngOnInit();

    // Expectation: The fetchUsers method should have been called.
    expect(userService.fetchUsers).toHaveBeenCalled();

    // Expectation: The component's 'users' property should now be populated with the mock user data,
    // confirming that the component is handling the fetched data as expected.
    expect(component.users).toEqual(mockUsers);
  });
});
