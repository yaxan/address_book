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

    service['usersCache'] = null;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve users from the API via GET', () => {
    const dummyUsers: User[] = [
      {
        login: { uuid: '1' },
        name: { title: 'mr', first: 'john', last: 'doe' },
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        location: { city: 'Anytown', state: 'Anystate', country: 'Country' },
        picture: {
          large: "https://randomuser.me/api/portraits/men/75.jpg",
          medium: "https://randomuser.me/api/portraits/med/men/75.jpg",
          thumbnail: "https://randomuser.me/api/portraits/thumb/men/75.jpg"
        }
      },
      {
        login: { uuid: '2' },
        name: { title: 'ms', first: 'jane', last: 'doe' },
        email: 'jane.doe@example.com',
        phone: '123-456-7891',
        location: { city: 'Anytown', state: 'Somestate', country: 'Country' },
        picture: {
          large: "https://randomuser.me/api/portraits/men/75.jpg",
          medium: "https://randomuser.me/api/portraits/med/men/75.jpg",
          thumbnail: "https://randomuser.me/api/portraits/thumb/men/75.jpg"
        }
      },
    ];

    const apiResponse = { results: dummyUsers };

    service.fetchUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const request = httpMock.expectOne('https://randomuser.me/api/?seed=nuvalence&results=50');
    expect(request.request.method).toBe('GET');
    request.flush(apiResponse);
  });
});
