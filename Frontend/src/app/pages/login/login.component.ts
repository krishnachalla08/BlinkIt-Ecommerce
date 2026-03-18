import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports:[FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email=""
  password=""

  constructor(private authService:AuthService,
              private router:Router){}

  login(){

    const data={
      email:this.email,
      password:this.password
    }

    this.authService.login(data).subscribe((res:any)=>{

      this.authService.saveToken(res.token)

      alert("Login successful")

    })
  }

  register(){
    this.router.navigate(['/register'])
  }

  forgotPassword(){
    alert('Password reset functionality coming soon!');
    // You can navigate to a forgot-password page later
    // this.router.navigate(['/forgot-password'])
  }


}