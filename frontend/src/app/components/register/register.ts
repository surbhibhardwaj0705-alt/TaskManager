import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { response } from 'express';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  user ={
    name: '',
    email: '',
    password: '',
  };
  message: string = '';

  constructor(
    private auth: Auth,private router: Router
  ){}

  register(){
    this.auth.register(this.user).subscribe({
      
      next: () =>{
        alert('Registration successful! Please log in.');
         this.router.navigate(['/login']);
      },
     error: (err) => {
        console.log(err.error.message);
       // alert('Registration failed. Please try again.');
        alert('Error: ' + err.error.message);
      }
    });
  }
}
