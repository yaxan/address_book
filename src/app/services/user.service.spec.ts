// src/app/user.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that there are no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve users from the API via GET', () => {
    const dummyUsers: { results: User[] } = {
      results: [
        {
          login: { uuid: '1' },
          name: { title: 'mr', first: 'john', last: 'doe' },
          email: 'john.doe@example.com',
          phone: '123-456-7890',
          location: { city: 'Anytown', state: 'Anystate', country: 'Country' }
        },
        {
          login: { uuid: '2' },
          name: { title: 'ms', first: 'jane', last: 'doe' },
          email: 'jane.doe@example.com',
          phone: '123-456-7891',
          location: { city: 'Anytown', state: 'Somestate', country: 'Country' }
        },
      ]
    };
    
    service.fetchUsers(1).subscribe(users => {
      expect(users.results.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const request = httpMock.expectOne('https://randomuser.me/api/?seed=nuvalence&page=1&results=10');
    expect(request.request.method).toBe('GET');
    request.flush(dummyUsers);
  });
});
