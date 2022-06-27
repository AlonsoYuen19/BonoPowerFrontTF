import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { Login } from '../shared/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public login: Login=new Login();
  public invalid: boolean = true;

  constructor(
    private router:Router,
    private authService:AuthService,
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void{
    this.authService.logIn(this.login).subscribe((data:any)=>{
      this.router.navigate(['/admin/bonos'])
    }, (error)=>{
      this.invalid = true;
    });
  }

}
