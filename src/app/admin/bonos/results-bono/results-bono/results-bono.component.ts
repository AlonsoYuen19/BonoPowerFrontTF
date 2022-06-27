import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { flatMap } from 'rxjs';
import { Bono, Periodo } from '../../shared/bono.model';
import { BonoService } from '../../shared/bono.service';

@Component({
  selector: 'app-results-bono',
  templateUrl: './results-bono.component.html',
  styleUrls: ['./results-bono.component.css']
})
export class ResultsBonoComponent implements OnInit {

  bonoId:any;
  bonoActual!: Bono;
  periodoCupon!: Periodo;
  periodoCapitalizacion: Periodo={id:1, nombre:"Semestral", dias:40};
  

  frecuencia!:string;
  n_periodos_anio!:string;
  total_periodos!:string;
  tasaEA!:any;
  tasaEP!:any;
  cok!:any;
  costes_iniciales_emisor!:any;
  costes_iniciales_bonista!:any;


  valor_actual!:any;
  utilidad_p: any;
  ratioconv!:any;
  total!:any;
  duracion!: string;
  duracion_mod!:any;
  inflaciones_en_el_periodo!:string;

  trea!:string;
  trea_365!:any;
  tcea!:any;
  tcea_365!:any;

  tcea2!:any;
  tcea_2_365!:any;
  constructor(private bonoService:BonoService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe( params =>{
      this.bonoId = params['id']
      //this.getBonoById(this.bonoId)
      //this.getPeriodoCuponById(this.bonoActual.periodo_cupon_id,1)
      //this.getPeriodoCuponById(this.bonoActual.periodo_capitalizacion_id,0)
      //this.AMERICANO(this.bonoActual.VN, this.bonoActual.VC, this.periodoCupon.dias, this.bonoActual.Anios, this.bonoActual.P_Tasa_Interes, this.bonoActual.P_Tasa_Anual_Descuento, this.bonoActual.P_Impuesto)
      this.AMERICANO(1500000, 1500000, 180, 10, 0.032, 0, 0.30, [2.8, 2.5, 2.3], 2, 2, 2, 2, 2)
    });
  }

  getBonoById(id: number){
    this.bonoService.getBonoById(id).subscribe((data)=>{
      this.bonoActual = data
    });
  }

  getPeriodoCuponById(id: number,p:number){
    this.bonoService.getPeriodoCuponById(id).subscribe((data)=>{
      if(p==1){
        this.periodoCupon = data
      }else{
        this.periodoCapitalizacion = data
      }
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
        NPV += arr[i]/Math.pow(1+g, i);
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
    let temp = []
    let temp2 = 0
    for(let i = 0;i<arr.length;i++){
      temp2 = arr[i]*(i+1)*(i+2);
      temp.push(temp2);
    }
    return temp;
  }

  fxp(arr:any){
    let temp = [];
    let temp2 = 0;
    let per = 180/360;

    for(let i = 0; i < arr.length; i++){
      temp2 += arr[i]*(i+1)*per;
      temp.push(temp2);
    }

    return temp;
  }

  npv(arr: any, t: any){
    let temp = 0;

    for(let i = 0; i < arr.length; i++){
      temp += arr[i]/Math.pow(1+t, i+1);
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

  AMERICANO(vn: any, vc: any, frec: any, anios: any, ti: any, td: any, ir: any, inflaciones: any, p_prima: any, p_estructuracion:any, p_colocacion:any, p_flotacion: any, p_cavali: any){
    let per = 360/frec;
    let per3 = 365/frec;
    let p = Math.floor(per*anios);

    let ntasa = this.convertasa(frec, ti);
    let cok = this.convertasa(frec, td);

    this.frecuencia = frec;
    this.n_periodos_anio = per.toString();
    this.total_periodos = p.toString();
    this.tasaEA = (ti*100).toFixed(1).concat("%");
    this.tasaEP = (ntasa*100).toString().concat("%");
    this.cok = (cok*100).toString().concat("%");
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
    let flujoemisor = []

    let sum_cie = p_estructuracion + p_cavali + p_colocacion + p_flotacion
    let costes_iniciales_emisor = 0
    if(sum_cie != 0)
      costes_iniciales_emisor = (sum_cie/100)*vc
    this.costes_iniciales_emisor = costes_iniciales_emisor;
    let sum_cib = p_cavali + p_flotacion
    let costes_iniciales_bonista = 0
    if(sum_cib != 0)
      costes_iniciales_bonista = (sum_cib/100)*vc
    this.costes_iniciales_bonista = costes_iniciales_bonista;
    fbon.push((vc*-1)-costes_iniciales_bonista);
    flujoemisor.push((vc*-1)+costes_iniciales_emisor)

    let escudo = []

    for(let i = 0; i < p; i++){
      escudo.push(BonoIndexado[i]*ntasa*ir)
    }

    let fact = [];
    let ci = [];
    let flujoescudo = [];

    let prima = 0
    if(p_prima != 0){
      prima = vn*(p_prima/100);
    }

    let temp2 = 0;
    for(let i = 1; i < p+1; i++){

      if(i < p){
        let temp = BonoIndexado[i-1]*ntasa;
        temp2 = temp/Math.pow(1+cok, i);

        fbon.push(temp);
        flujoemisor.push(temp)
        ci.push(temp);
        fact.push(temp2);
      }

      if(i == p){
        let temp = BonoIndexado[i-1]*ntasa;
        ci.push(temp);
        fbon.push(BonoIndexado[i-1] + temp + prima);
        flujoemisor.push(temp+BonoIndexado[i-1]+prima)

        temp2 = (temp + BonoIndexado[i-1] + prima)/Math.pow(1+cok, i);
        fact.push(temp2);
      }
    }

    for(let i = 0; i < fbon.length; i++){

      if(i == 0){
        flujoescudo.push(fbon[i] + costes_iniciales_bonista + costes_iniciales_emisor);
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

    //resultados

    
    let temp3 = fbon.slice(1);
    //valor actual
    let va = this.npv(temp3,cok);
    this.valor_actual = va.toFixed(2);
    //utilidad perdida
    let utped = va+(fbon[0]);
    this.utilidad_p=utped.toFixed(2);
    let sumFact=0;
    for(let i = 0;i<fact.length;i++){
      sumFact += fact[i];
    }

    let sumFap=0;
    for(let i = 0;i<fap.length;i++){
      sumFap += fap[i];
    }




    let duracion = sumFap/sumFact;
    this.duracion = (duracion).toFixed(2);
    console.log("aaa");
    console.log(this.duracion);
    let ratioconv = this.ratioconvx(facp,fact,cok);
    this.ratioconv = ratioconv.toFixed(2);

    let total = ratioconv+duracion;;
    this.total=total.toFixed(2);
    
    let duracionmod = duracion/(1+cok);
    this.duracion_mod=duracionmod.toFixed(2);

    let irr = this.irrcalc(flujoemisor);
    let tcea = 100*(Math.pow((irr+1),per)-1)
    let tcea_365 = 100*(Math.pow((irr+1),per3)-1)
    this.tcea=tcea.toFixed(5).concat("%");
    this.tcea_365=tcea_365.toFixed(5).concat("%");

    let irr2 = this.irrcalc(flujoescudo);
    let tcea2 = 100*(Math.pow((irr2+1),per)-1);
    let tcea_2_365 = 100*(Math.pow((irr2+1),per3)-1);
    this.tcea2=tcea2.toFixed(5).concat("%");
    this.tcea_2_365=tcea_2_365.toFixed(5).concat("%");

    let trea = 100*(Math.pow((irr+1),per)-1);
    let trea_365 = 100*(Math.pow((irr+1),per3)-1);
    this.trea=(trea).toFixed(5).concat("%");
    this.trea_365=(trea_365).toFixed(5).concat("%");
  }

}
