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

  displayedColumns: string[] = ['Indice', 'Inflacion_Periodo' ,'Bono', 'Bono_Indexado','Cupon_Interes', 'Flujo_Escudo', 'Flujo_Bonista', 'Flujo_Actual', 'FlujoXPlazo', 'Factor_Convexividad'];
  dataSource: ObjetoTabla[] = [];

  ngOnInit(): void {
    this.route.params.subscribe( params =>{
      this.bonoId = params['id']
      //this.getBonoById(this.bonoId)
      //this.getPeriodoCuponById(this.bonoActual.Periodo_Cupon_id)
      //this.AMERICANO(this.bonoActual.VN, this.bonoActual.VC, this.periodoCupon.dias, this.bonoActual.Anios, this.bonoActual.P_Tasa_Interes, this.bonoActual.P_Tasa_Anual_Descuento, this.bonoActual.P_Impuesto)
      this.AMERICANO(1500000, 1500000, 180, 10, 0.032, 0, 0.30, [2.8, 2.5, 2.3])
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

  AMERICANO(vn: any, vc: any, frec: any, anios: any, ti: any, td: any, ir: any, inflaciones: any){
    let per = 360/frec;
    let p = Math.floor(per*anios);

    let ntasa = this.convertasa(frec, ti);
    let cok = this.convertasa(frec, td);

    let Bono = [];
    let BonoIndexado = [];
    let InflacionesPeriodo = [];

    let InflacionesAnios = [];
    for(let i = 0; i < anios; i++){
      InflacionesAnios.push(0);
    }

    InflacionesAnios[0] = inflaciones[0];
    InflacionesAnios[1] = inflaciones[1];
    InflacionesAnios[2] = inflaciones[2];

    for(let i = 0; i < InflacionesAnios.length; i++){
      let inflacion_en_el_periodo = 0;

      if(InflacionesAnios[i] != 0){
        inflacion_en_el_periodo = Math.pow(1+(InflacionesAnios[i]/100.0), frec/360) - 1;
      }
      
      for(let j = 0; j < per; j++){
        InflacionesPeriodo.push(inflacion_en_el_periodo);
      }
    }

    Bono.push(vn);
    BonoIndexado.push(Bono[0]*(1+InflacionesPeriodo[0]));

    for(let i = 0; i < p; i++){
      if(i != 0){
        Bono.push(BonoIndexado[i-1]);
        BonoIndexado.push(Bono[i]*(1+InflacionesPeriodo[i]));
      }
    }

    let fbon = [];
    fbon.push(vc*-1);

    let escudo = []

    for(let i = 0; i < p; i++){
      escudo.push(BonoIndexado[i]*ntasa*ir)
    }

    let fact = [];
    let ci = [];
    let flujoescudo = [];

    let temp2 = 0;

    for(let i = 1; i < p+1; i++){

      if(i < p){
        let temp = BonoIndexado[i-1]*ntasa;
        temp2 = temp/Math.pow(1+cok, i);

        fbon.push(temp);
        ci.push(temp);
        fact.push(temp2);
      }

      if(i == p){
        let temp = BonoIndexado[i-1]*ntasa;
        ci.push(temp);
        fbon.push(BonoIndexado[i-1] + temp);

        temp2 = (temp + BonoIndexado[i-1])/Math.pow(1+cok, i);
        fact.push(temp2);
      }
    }

    for(let i = 0; i < fbon.length; i++){

      if(i == 0){
        flujoescudo.push(fbon[i]);
      }
      else{
        flujoescudo.push(fbon[i] - escudo[i-1]);
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
          Inflacion_Periodo: "0%",
          Bono: "0",
          Bono_Indexado: "0",
          Cupon_Interes: "0",
          Flujo_Escudo: flujoescudo[i].toFixed(2),
          Flujo_Bonista: fbon[i].toFixed(2),
          Flujo_Actual: "0",
          FlujoXPlazo: "0",
          Factor_Convexividad: "0"
        });
      }
      else{
        this.objetoTabla = ({
          Indice: i,
          Inflacion_Periodo: (InflacionesPeriodo[i-1]*100).toFixed(3) + "%",
          Bono: Bono[i-1].toFixed(2),
          Bono_Indexado: BonoIndexado[i-1].toFixed(2),
          Cupon_Interes: ci[i-1].toFixed(2),
          Flujo_Escudo: flujoescudo[i].toFixed(2),
          Flujo_Bonista: fbon[i].toFixed(2),
          Flujo_Actual: fact[i-1].toFixed(2),
          FlujoXPlazo: fap[i-1].toFixed(2),
          Factor_Convexividad: facp[i-1].toFixed(2)
        });
      }

      this.dataSource.push(this.objetoTabla);
    }
  }

  resultados(){
    this.router.navigate([`/admin/bonos/resultados/${this.bonoId}`]);
  }
}
