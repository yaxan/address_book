import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-details',
  template: `
    <div *ngIf="user">
      <img [src]="user.picture.large" alt="User Image" loading="lazy">
      <h1>{{ user.name.title }} {{ user.name.first }} {{ user.name.last }}</h1>
      <p>Phone: {{ user.phone }}</p>
      <p>Email: {{ user.email }}</p>
      <p>Location: {{ user.location.city }}, {{ user.location.state }}, {{ user.location.country }}</p>
    </div>
  `,
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  user?: User;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.user = this.userService.getUserById(id);
    }
  }
}
