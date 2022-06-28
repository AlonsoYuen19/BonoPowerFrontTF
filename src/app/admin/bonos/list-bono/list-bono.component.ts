import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BonoService } from '../shared/bono.service';

@Component({
  selector: 'app-list-bono',
  templateUrl: './list-bono.component.html',
  styleUrls: ['./list-bono.component.css']
})
export class ListBonoComponent implements OnInit {

  bonos: any = [];
  userId!: any;
  bonoId: any = 0;

  constructor(private bonoService:BonoService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe( params =>{
      this.userId = params['id']
      this.getBonosUser(this.userId)
    });
  }

  getBonosUser(id: number){
    this.bonoService.getAll(id).subscribe((data: any)=>{
      console.log(data)
      if(data != null){
        for(let i = 0; i < data.length; i++){
          this.bonos.push({
            id: data[i].id, 
            nombre: data[i].nombre, 
            importancia: data[i].importancia, 
            createdAt: new Date(data[i].createdAt)})
        }
      }
      console.log(this.bonos)
    });
  }

  abrir(id: number){
    this.router.navigate([`/admin/bonos/calcular/${id}`]);
  }

  nuevo(id: number){
    this.router.navigate([`/admin/bonos/nuevo/${id}`]);
  }

  eliminar(id: number){
    this.bonoService.deleteBono(id).subscribe((data: any)=>{
      console.log(data)
      let currentUrl = this.router.url;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([currentUrl]);
    });
  }
}
