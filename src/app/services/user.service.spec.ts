import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../models/user.model';

/**
 * UserService Test Suite
 *
 * This test suite performs comprehensive unit testing on the UserService class. UserService is pivotal
 * in managing user data interactions between the application and the backend (specifically, the RandomUser API).
 * These tests aim to validate that the service accurately performs HTTP requests, handles responses,
 * and processes user data, ensuring the reliability and stability of user data management.
 */
describe('UserService', () => {
  // Instance of the UserService to be tested.
  let service: UserService;

  // Mock for simulating HTTP requests and expecting certain requests to be made.
  let httpMock: HttpTestingController;

  /**
   * Initial setup for each test case in the suite. This setup is critical for isolating each test scenario
   * to prevent data leak or state alteration between tests, ensuring consistent and reliable test execution.
   */
  beforeEach(() => {
    // Setting up the TestBed environment for the service testing.
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Import HttpClient mock testing module.
      providers: [UserService], // Declare the service under test.
    });

    // Initializing the service and httpMock from the testing environment.
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);

    // Ensuring usersCache is null before each test for consistency.
    service['usersCache'] = null;
  });

  /**
   * Cleanup phase after each test case. This phase is essential to ensure no residual data affects subsequent tests.
   */
  afterEach(() => {
    httpMock.verify(); // Verifying that no HTTP requests are outstanding.
  });

  /**
   * Test Case: Service Creation
   *
   * This test verifies the basic creation of the UserService. The successful creation of the service is
   * foundational to the further functionalities provided by this service.
   */
  it('should be created', () => {
    expect(service).toBeTruthy(); // Asserting that the service instance is created and is not null.
  });

  /**
   * Test Case: Fetching Users via HTTP GET
   *
   * This test case is dedicated to the 'fetchUsers' functionality of the UserService. It validates that the service
   * correctly performs an HTTP GET request to the specified URL, processes the response, and provides the user data.
   * The mock HTTP request helps in isolating the service behavior from network instability and API inconsistencies.
   */
  it('should retrieve users from the API via GET', () => {
    // Mock data representing the users as expected from the backend.
    const dummyUsers: User[] = [
      {
        login: { uuid: '1' },
        name: { title: 'mr', first: 'john', last: 'doe' },
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        location: { city: 'Anytown', state: 'Anystate', country: 'Country' },
        picture: {
          large: 'https://randomuser.me/api/portraits/men/75.jpg',
          medium: 'https://randomuser.me/api/portraits/med/men/75.jpg',
          thumbnail: 'https://randomuser.me/api/portraits/thumb/men/75.jpg',
        },
      },
      {
        login: { uuid: '2' },
        name: { title: 'ms', first: 'jane', last: 'doe' },
        email: 'jane.doe@example.com',
        phone: '123-456-7891',
        location: { city: 'Anytown', state: 'Somestate', country: 'Country' },
        picture: {
          large: 'https://randomuser.me/api/portraits/men/75.jpg',
          medium: 'https://randomuser.me/api/portraits/med/men/75.jpg',
          thumbnail: 'https://randomuser.me/api/portraits/thumb/men/75.jpg',
        },
      },
    ];

    // Simulating an API response structure.
    const apiResponse = { results: dummyUsers };

    // Start observing the service's fetchUsers method.
    service.fetchUsers().subscribe((users) => {
      expect(users.length).toBe(2); // Expecting the service to correctly process and deliver two users.
      expect(users).toEqual(dummyUsers); // Asserting the received data matches the mocked users.
    });

    // Asserting expectations for the HTTP request made by the service.
    const request = httpMock.expectOne(
      'https://randomuser.me/api/?seed=nuvalence&results=50',
    );
    expect(request.request.method).toBe('GET'); // It should make a 'GET' request.

    // Confirm and resolve the mock HTTP request with our mock data.
    request.flush(apiResponse);
  });
});
