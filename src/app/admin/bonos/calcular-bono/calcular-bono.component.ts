import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bono, Inflacion, ObjetoTabla, Periodo } from '../shared/bono.model';
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

  inflaciones: any = [];

  displayedColumns: string[] = ['Indice', 'Inflacion_Periodo' ,'Bono', 'Bono_Indexado', 'Cupon_Interes', 'Flujo_Emisor', 'Flujo_Escudo', 'Flujo_Bonista', 'Flujo_Actual', 'FlujoXPlazo', 'Factor_Convexividad'];
  dataSource: ObjetoTabla[] = [];

  ngOnInit(): void {
    this.route.params.subscribe( params =>{
      this.bonoId = params['id']
      this.getInflaciones(this.bonoId)
      this.getBonoById(this.bonoId)
      //this.AMERICANO(1500000, 1500000, 180, 10, 0.032, 0, 0.30, [2.8, 2.5, 2.3], 2, 2, 2, 2, 2)
    });
  }

  getBonoById(id: number){
    this.bonoService.getBonoById(id).subscribe((data)=>{
      this.bonoActual = data
      this.getPeriodoCuponById(this.bonoActual.periodo_cupon_id)
    });
  }

  getPeriodoCuponById(id: number){
    this.bonoService.getPeriodoCuponById(id).subscribe((data)=>{
      this.periodoCupon = data
      this.AMERICANO(this.bonoActual.vn, this.bonoActual.vc, this.periodoCupon.dias, this.bonoActual.anios, this.bonoActual.p_tasa_interes, this.bonoActual.p_tasa_anual_descuento, this.bonoActual.p_impuesto, this.inflaciones, this.bonoActual.p_prima, this.bonoActual.p_estructuracion, this.bonoActual.p_colocacion, this.bonoActual.p_flotacion, this.bonoActual.p_cavali)
    });
  }

  convertasa(frec: any, tasa: any){
    return (Math.pow(1+tasa, frec/360) - 1);
  }

  AMERICANO(vn: any, vc: any, frec: any, anios: any, ti: any, td: any, ir: any, inflaciones: any, p_prima: any, p_estructuracion:any, p_colocacion:any, p_flotacion: any, p_cavali: any){
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

    if(inflaciones.length != 0){
      for(let i = 0; i < inflaciones.length; i++){
        InflacionesAnios[inflaciones[i].anio - 1] = inflaciones[i].inflacion
      }
    }

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

    let sum_cib = p_cavali + p_flotacion
    let costes_iniciales_bonista = 0
    if(sum_cib != 0)
      costes_iniciales_bonista = (sum_cib/100)*vc

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
    
    for(let i = 0; i < fbon.length; i++){
      
      if(i == 0){
        this.objetoTabla = ({
          Indice: i,
          Inflacion_Periodo: "0%",
          Bono: "0",
          Bono_Indexado: "0",
          Cupon_Interes: "0",
          Flujo_Emisor: flujoemisor[i].toFixed(2),
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
          Flujo_Emisor: flujoemisor[i].toFixed(2),
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

  getInflaciones(id: number){
    this.bonoService.getInflaciones(id)
    .subscribe((data: any)=>{
      if(data != null){
        for(let i = 0; i < data.length; i++){
          this.inflaciones = data;
        }
      }
    });
  }
}
