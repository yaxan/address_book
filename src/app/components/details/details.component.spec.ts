import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DetailsComponent } from './details.component';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

/**
 * DetailsComponent Test Suite
 *
 * This suite of tests is designed to test the DetailsComponent class, ensuring that the
 * component is created successfully and behaves as expected under certain conditions,
 * particularly in fetching and displaying user details.
 */
describe('DetailsComponent', () => {
  // Component instance for testing.
  let component: DetailsComponent;

  // Test environment fixture containing the created component.
  let fixture: ComponentFixture<DetailsComponent>;

  // Service used by the component, to be injected as a dependency.
  let userService: UserService;

  // Mock data representing a user, mimicking the data structure that would typically be
  // retrieved from a backend service.
  const mockUser: User = {
    login: { uuid: 'sample-uuid' },
    name: { title: 'mr', first: 'brad', last: 'gibson' },
    phone: '011-962-7516',
    email: 'brad.gibson@example.com',
    location: { city: 'kilcoole', state: 'waterford', country: 'ireland' },
    picture: {
      large: 'https://randomuser.me/api/portraits/men/75.jpg',
      medium: 'https://randomuser.me/api/portraits/med/men/75.jpg',
      thumbnail: 'https://randomuser.me/api/portraits/thumb/men/75.jpg',
    },
  };

  /**
   * Set up the Angular testing environment for this component.
   * This configuration is established before each test in the suite.
   */
  beforeEach(async () => {
    // Configure the component's testing environment.
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatCardModule, MatIconModule],
      declarations: [DetailsComponent],
      providers: [
        {
          provide: ActivatedRoute, // Mocking the ActivatedRoute to test the component under specific route conditions.
          // Specifically, we simulate a route snapshot containing a particular 'id' parameter.
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id: 'sample-uuid' }) },
          },
        },
        UserService, // The actual service, allowing us to spy on its methods later.
      ],
    }).compileComponents(); // Compile the testing module asynchronously.
  });

  /**
   * Executes before each test is run; sets up component environment.
   */
  beforeEach(() => {
    // Create an instance of the component along with its test fixture.
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance; // Acquire the component instance.

    // Inject the user service into the testing environment (to spy on its methods).
    userService = TestBed.inject(UserService);

    // Create a Jasmine spy on the 'getUserById' method of the UserService.
    // Instead of making an actual call, it will return our mock user data.
    spyOn(userService, 'getUserById').and.returnValue(mockUser);

    // Initiate change detection for the component, thereby applying mock data bindings.
    fixture.detectChanges();
  });

  /**
   * Test: Should verify the component is created successfully.
   */
  it('should create', () => {
    // Assertion: The component should exist/be truthy.
    expect(component).toBeTruthy();
  });

  /**
   * Test: Should handle user detail retrieval on initialization.
   */
  it('should retrieve user details on init', () => {
    // Trigger the component's 'ngOnInit' lifecycle hook method.
    component.ngOnInit();

    // Assertion: The 'getUserById' service method was called with the specific mock 'id'.
    expect(userService.getUserById).toHaveBeenCalledWith('sample-uuid');

    // Assertion: The component's 'user' property should now hold the mock user data.
    expect(component.user).toEqual(mockUser);
  });
});
