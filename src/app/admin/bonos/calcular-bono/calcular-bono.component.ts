import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bono, ObjetoTabla, Periodo } from '../shared/bono.model';
import { BonoService } from '../shared/bono.service';

@Component({
  selector: 'app-calcular-bono',
  templateUrl: './calcular-bono.component.html',
  styleUrls: ['./calcular-bono.component.css']
})
export class CalcularBonoComponent implements OnInit {

  constructor(private bonoService:BonoService, private router:Router, private route:ActivatedRoute) { }
  
  bonoId:any;
  bonoActual!: Bono;
  periodoCupon!: Periodo;
  
  objetoTabla: ObjetoTabla | undefined;

  displayedColumns: string[] = ['Indice', 'Cupon_Interes', 'Flujo_Escudo', 'Flujo_Bonista', 'Flujo_Actual', 'FlujoXPlazo', 'Factor_Convexividad'];
  dataSource: ObjetoTabla[] = [];

  ngOnInit(): void {
    this.route.params.subscribe( params =>{
      this.bonoId = params['id']
      //this.getBonoById(this.bonoId)
      //this.getPeriodoCuponById(this.bonoActual.Periodo_Cupon_id)
      //this.AMERICANO(this.bonoActual.VN, this.bonoActual.VC, this.periodoCupon.dias, this.bonoActual.Anios, this.bonoActual.P_Tasa_Interes, this.bonoActual.P_Tasa_Anual_Descuento, this.bonoActual.P_Impuesto)
      this.AMERICANO(1500000, 1500000, 180, 10, 0.032, 0, 0.30)
    });
  }

  getBonoById(id: number){
    this.bonoService.getBonoById(id).subscribe((data)=>{
      this.bonoActual = data
    });
  }

  getPeriodoCuponById(id: number){
    this.bonoService.getPeriodoCuponById(id).subscribe((data)=>{
      this.periodoCupon = data
    });
  }

  irrcalc(arr: any){
    let min = 0.0;
    let max = 1.0;
    let NPV = 1;
    let g = 0;

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

  npv(arr: any, t: any){
    let temp = 0;

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

    for(let i = 1; i < p+1; i++){

      if(i < p){
        let temp = vn*ntasa;
        temp2 = temp/Math.pow(1+cok, i);

        fbon.push(temp);
        ci.push(temp);
        fact.push(temp2);
      }

      if(i == p){
        let temp = vn*ntasa;
        ci.push(vn + temp);
        fbon.push(vn + temp);

        temp2 = (temp + vn)/Math.pow(1+cok, i);
        fact.push(temp2);
      }
    }

    for(let i = 0; i < fbon.length; i++){

      if(i == 0){
        flujoescudo.push(fbon[i]);
      }
      else{
        flujoescudo.push(fbon[i] - escudo);
      }
    }

    let fap = [];
    let per2 = 180/360;
    for(let i = 0; i < fact.length; i++){
      let temp2 = fact[i] * (i+1) * per2;
      fap.push(temp2);
    }
    

    let facp = [];
    for(let i = 0; i < fact.length; i++){
      let temp3 = fact[i] * (i+1) * (i+2);
      facp.push(temp3);
    }

    for(let i = 0; i < fbon.length; i++){
      
      if(i == 0){
        this.objetoTabla = ({
          Indice: i,
          Cupon_Interes: 0,
          Flujo_Escudo: flujoescudo[i],
          Flujo_Bonista: fbon[i],
          Flujo_Actual: 0,
          FlujoXPlazo: 0,
          Factor_Convexividad: 0
        });
      }
      else{
        this.objetoTabla = ({
          Indice: i,
          Cupon_Interes: ci[i-1],
          Flujo_Escudo: flujoescudo[i],
          Flujo_Bonista: fbon[i],
          Flujo_Actual: fact[i-1],
          FlujoXPlazo: fap[i-1],
          Factor_Convexividad: facp[i-1]
        });
      }

      this.dataSource.push(this.objetoTabla);
    }
  }
}
