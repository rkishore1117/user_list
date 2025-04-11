import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from 'src/user.model';
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  userForm!: FormGroup;
  isEditMode = false;
  userId!: number;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      // email: ['', [Validators.required, Validators.email]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],

      role: ['', Validators.required],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.userId = +id;
      const user = this.userService.getUserById(this.userId);
      if (user) {
        this.userForm.patchValue(user);
      }
    }
  }




  onSubmit(): void {
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);  
      return;
    }
  
    const user: User = {
      id: this.userId || 0,
      ...this.userForm.value
    };
  
    if (this.isEditMode) {
      this.userService.updateUser(user);
    } else {
      this.userService.addUser(user);
    }
  
    this.router.navigate(['/']);
  }
  
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as FormGroup).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
  

}
