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

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let userService: UserService;
  const mockUsers: { results: User[] } = {
    results: [
      {
        login: { uuid: 'sample-uuid-1' },
        name: { title: 'ms', first: 'susan', last: 'doe' },
        phone: '123-456-7890',
        email: 'susan.doe@example.com',
        location: { city: 'city', state: 'state', country: 'country' },
        picture: {
          large: "https://randomuser.me/api/portraits/men/75.jpg",
          medium: "https://randomuser.me/api/portraits/med/men/75.jpg",
          thumbnail: "https://randomuser.me/api/portraits/thumb/men/75.jpg"
        }
      },
      {
        login: { uuid: 'sample-uuid-2' },
        name: { title: 'mr', first: 'john', last: 'doe' },
        phone: '123-456-7890',
        email: 'john.doe@example.com',
        location: { city: 'city', state: 'state', country: 'country' },
        picture: {
          large: "https://randomuser.me/api/portraits/men/75.jpg",
          medium: "https://randomuser.me/api/portraits/med/men/75.jpg",
          thumbnail: "https://randomuser.me/api/portraits/thumb/men/75.jpg"
        }
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatCardModule,
        MatGridListModule,
        MatToolbarModule
      ],
      declarations: [ ListComponent ],
      providers: [ UserService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);

    spyOn(userService, 'fetchUsers').and.returnValue(of(mockUsers));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve users on init', () => {
    component.ngOnInit();

    expect(userService.fetchUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers.results);
  });
});
