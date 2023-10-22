import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { User } from '../models/user.model';

/**
 * UserService is a service class responsible for handling operations related to User data.
 * It manages API requests to fetch user data, caching of user data, and user data retrieval.
 * This service can be injected throughout the application, ensuring consistent data handling
 * and interaction with the User model.
 */
@Injectable({
  providedIn: 'root', // This service is provided in the root injector, making it available application-wide.
})
export class UserService {
  private apiUrl = 'https://randomuser.me/api/?seed=nuvalence'; // Base URL of the user data API.
  private usersCache: User[] | null = null; // Cache to store user data and minimize redundant requests.

  /**
   * Constructor for the UserService, where dependency injection for HttpClient occurs.
   * @param http An HttpClient instance for sending HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Fetches a list of users from the API or returns the cached user data if available.
   * It performs an HTTP GET request, processes the response, and caches the user data.
   * @returns An Observable emitting an array of User objects.
   */
  fetchUsers(): Observable<User[]> {
    // Check if user data is already cached to avoid unnecessary HTTP requests.
    if (this.usersCache) {
      // Return the cached user data as an Observable.
      return of(this.usersCache);
    }

    // Construct the URL for the API request, specifying the number of results.
    const url = `${this.apiUrl}&results=50`;

    // Perform the HTTP GET request.
    return this.http.get<{ results: User[] | null }>(url).pipe(
      tap((data: { results: User[] | null }) => {
        // Cache the user data to optimize future requests.
        this.usersCache = data.results;
      }),
      map((data: { results: User[] | null }) => {
        // Transform the response to emit only the user data array.
        return data.results as User[];
      }),
    );
  }

  /**
   * Stores the provided user data array in local storage.
   * This method allows for persistence of user data during the session.
   * @param users An array of User objects.
   */
  setUsers(users: User[]): void {
    // Convert the user data into a JSON string and store it in local storage.
    localStorage.setItem('users', JSON.stringify(users));
  }

  /**
   * Retrieves the array of users from local storage.
   * @returns An array of User objects.
   */
  getUsers(): User[] {
    // Retrieve the 'users' JSON string from local storage.
    const users = localStorage.getItem('users');

    // Parse and return the JSON string as an array of User objects, or an empty array if not found.
    return users ? JSON.parse(users) : [];
  }

  /**
   * Retrieves a single user by their unique identifier.
   * @param id The unique identifier (UUID) of the user.
   * @returns A User object if found, or undefined.
   */
  getUserById(id: string): User | undefined {
    // Retrieve the full list of users from local storage.
    const users = this.getUsers();

    // Find and return the user with the matching UUID.
    return users.find((user) => user.login.uuid === id);
  }
}
