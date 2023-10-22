import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DetailsComponent } from './details.component';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let userService: UserService;
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatCardModule, MatIconModule],
      declarations: [DetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id: 'sample-uuid' }) },
          },
        },
        UserService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    spyOn(userService, 'getUserById').and.returnValue(mockUser);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve user details on init', () => {
    component.ngOnInit();

    expect(userService.getUserById).toHaveBeenCalledWith('sample-uuid');
    expect(component.user).toEqual(mockUser);
  });
});
