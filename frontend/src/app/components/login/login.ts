import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { debug, error } from 'console';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  user ={
    email: '',
    password: '',
  };
  
  constructor(private auth: Auth, private router: Router){}

  login(){
    this.auth.login(this.user).subscribe({
        next: (res)=>{
          this.auth.saveToken(res.token);
          alert('Login successful!');
          this.router.navigate(['/dashboard']);
     },

      error: (err) => {
        console.log(err);
        alert('Login failed. Please check your credentials and try again.');
      }
    });
  }
  register(){
    this.router.navigate(['/register']);
  }
}
