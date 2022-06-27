import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  userId: number = environment.userId;
  constructor(
    private router:Router
  ) { }

  ngOnInit(): void {
  }

  verPerfil(): void{
    this.router.navigate(['admin/usuario'])
  }

  signOut(): void{
    this.router.navigate(['/auth/login']);
  }

  listar(): void{
    this.router.navigate([`/admin/bonos/${this.userId}`]);
  }
}

