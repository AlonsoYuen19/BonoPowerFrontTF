import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/auth.service';
import { Login } from '../shared/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public login: any = {
    email: "",
    pwd: "",
  };
  public invalid: boolean = true;

  constructor(
    private router:Router,
    private authService:AuthService,private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void{
    this.authService.logIn(this.login).subscribe((data:any)=>{
      if(this.login.email == data.email && this.login.pwd == data.pwd){
        environment.userId = data.id;
        this.router.navigate([`/admin/bonos/${data.id}`])
      }
      else{
        this.openSnackBar("CORREO O CONTRASEÑA INCORRECTOS","ERROR")
      }
    }, (error)=>{
      this.invalid = true;
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2 * 1000,
    });
  }

}
