import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BonoService } from '../shared/bono.service';

@Component({
  selector: 'app-calcular-bono',
  templateUrl: './calcular-bono.component.html',
  styleUrls: ['./calcular-bono.component.css']
})
export class CalcularBonoComponent implements OnInit {

  constructor(private bonoService:BonoService, private router:Router, private route:ActivatedRoute) { }
  
  bonoId:any;
  bonoActual: any;

  ngOnInit(): void {
    this.route.params.subscribe( params =>{
      this.bonoId = params['id']
      this.getBonoById(this.bonoId)
    });
  }

  getBonoById(id: number){
    this.bonoService.getBonoById(id).subscribe((data)=>{
      this.bonoActual = data
    });
  }

  irrcalc(arr: any){
    var min = 0.0;
    var max = 1.0;
    var NPV = 1;
    var g = 0;

    while(Math.abs(NPV) > 0.000001){
      g = (min + max) / 2;

      NPV = 0;
      for(let i = 0; i < arr.length; i++){
        NPV += arr[i].valor/Math.pow(1+g, i);
      }

      if(NPV > 0){
        min = g;
      }
      else{
        max = g;
      }
    }
    return g;
  }

  convertasa(frec: any, tasa: any){
    return (Math.pow(1+tasa, frec/360) - 1);
  }

  factorconvx(arr: any){
    var temp = [];

    for(let i = 0; i < arr.length; i++){
      var temp2 = arr[i].valor * (i+1) * (i+2);
      temp.push(temp2);
    }

    return temp;
  }

  fxp(arr: any){
    var temp = [];
    var per = 180/360;

    for(let i = 0; i < arr.length; i++){
      var temp2 = arr[i].valor * (i+1) * per;
      temp.push(temp2);
    }

    return temp;
  }

  npv(arr: any, t: any){
    var temp = 0;

    for(let i = 0; i < arr.length; i++){
      temp += arr[i].valor/Math.pow(1+t, i+1);
    }

    return temp;
  }

  ratioconvx(arr: any, arr1: any, cok: any){
    let temp = 0;

    for (let i = 0; i < arr.length; i++) {
      temp += arr[i];
    }

    let temp2 = 0;

    for (let i = 0; i < arr1.length; i++) {
      temp2 += arr1[i];
    }

    let p = 360/180;

    let res = temp/(Math.pow(1+cok, 2) * temp2 * Math.pow(p, 2));

    return res;
  }

  AMERICANO(vn: any, vc: any, frec: any, anios: any, ti: any, td: any, ir: any){
    let per = 360/frec;
    let p = Math.floor(per*anios);

    let ntasa = this.convertasa(frec, ti);
    let cok = this.convertasa(frec, td);

    let fbon = [];
    fbon.push(vc*-1);

    let escudo = (vn*ntasa*ir)
    let fact = [];
    let ci = [];
    let flujoescudo = [];

    let temp2 = 0;

    for(let i = 0; i < p+1; i++){
      
    }
  }

  calcularBono(){
    
  }

}
