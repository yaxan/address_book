import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DetailsComponent } from './details.component';
import { UserService } from '../user.service';
import { User } from '../models/user.model';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let userService: UserService;
  const mockUser: User = {
    login: { uuid: 'sample-uuid' },
    name: { title: 'mr', first: 'brad', last: 'gibson' },
    phone: '011-962-7516',
    email: 'brad.gibson@example.com',
    location: { city: 'kilcoole', state: 'waterford', country: 'ireland' }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ DetailsComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: 'sample-uuid' }) } }
        },
        UserService
      ]
    })
    .compileComponents();
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
