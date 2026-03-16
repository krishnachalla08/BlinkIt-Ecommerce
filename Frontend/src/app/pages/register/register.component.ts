import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {

  name: string = '';
  phoneNumber: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  isAdmin: boolean = false;

  // Error messages
  phoneError: string = '';
  emailError: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';

  constructor(private authService: AuthService) {
    console.log('RegisterComponent constructor called');
  }

  ngOnInit() {
    console.log('RegisterComponent ngOnInit called');
  }

  // Validation methods
  validatePhoneNumber(): boolean {
    const phoneRegex = /^[6-9][0-9]{9}$/; // Indian phone number format
    if (!this.phoneNumber) {
      this.phoneError = 'Phone number is required';
      return false;
    }
    if (!phoneRegex.test(this.phoneNumber)) {
      this.phoneError = 'Phone number must be a valid 10-digit number (6-9)';
      return false;
    }
    this.phoneError = '';
    return true;
  }

  validateEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email) {
      this.emailError = 'Email is required';
      return false;
    }
    if (!emailRegex.test(this.email)) {
      this.emailError = 'Please enter a valid email address';
      return false;
    }
    this.emailError = '';
    return true;
  }

  validatePassword(): boolean {
    // Password: min 8 chars, uppercase, lowercase, number, special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (!this.password) {
      this.passwordError = 'Password is required';
      return false;
    }
    
    if (this.password.length < 8) {
      this.passwordError = 'Password must be at least 8 characters long';
      return false;
    }
    
    if (!/[a-z]/.test(this.password)) {
      this.passwordError = 'Password must contain at least one lowercase letter';
      return false;
    }
    
    if (!/[A-Z]/.test(this.password)) {
      this.passwordError = 'Password must contain at least one uppercase letter';
      return false;
    }
    
    if (!/\d/.test(this.password)) {
      this.passwordError = 'Password must contain at least one number';
      return false;
    }
    
    if (!/[@$!%*?&]/.test(this.password)) {
      this.passwordError = 'Password must contain at least one special character (@$!%*?&)';
      return false;
    }
    
    this.passwordError = '';
    return true;
  }

  validateConfirmPassword(): boolean {
    if (!this.confirmPassword) {
      this.confirmPasswordError = 'Confirm password is required';
      return false;
    }
    if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match';
      return false;
    }
    this.confirmPasswordError = '';
    return true;
  }

  register() {
    // Validate all fields
    const isPhoneValid = this.validatePhoneNumber();
    const isEmailValid = this.validateEmail();
    const isPasswordValid = this.validatePassword();
    const isConfirmPasswordValid = this.validateConfirmPassword();

    if (!isPhoneValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      alert('Please enter the details correctly');
      return;
    }

    const user = {
      name: this.name,
      phoneNumber : this.phoneNumber,
      email: this.email,
      password: this.password,
      role: this.isAdmin ? 'ADMIN' : 'USER'
    };

    this.authService.register(user).subscribe({

      next: (response) => {
        console.log("Registration successful", response);
        alert("Account created successfully");
      },

      error: (error) => {
        console.error("Registration failed", error);
        alert("Registration failed");
      }

    });

  }

}
