import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports:[FormsModule],
  templateUrl: './login.component.html'
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

      //this.router.navigate(['/products'])

    })
  }

}