import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { Signup } from '../shared/signup.model';
import { TermsComponent } from '../terms/terms.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public signup: Signup = new Signup();
  public invalid: boolean = true;
  public checked: boolean = false;
  
  constructor(
    private router:Router,
    private authService:AuthService,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
  }

  onSubmit(): void{
    this.authService.signUp(this.signup).subscribe((data:any)=>{
      this.router.navigate(['/auth/login'])
    }, (error)=>{
      this.invalid = true;
    });
  }

  openTerms(){
    if(!this.checked){
      const dialogRef = this.dialog.open(TermsComponent);
    }
  }

}
