import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NewInflacionComponent } from '../new-inflacion/new-inflacion.component';
import { InflacionReq, Periodo} from '../shared/bono.model';
import { BonoService } from '../shared/bono.service';

@Component({
  selector: 'app-new-bono',
  templateUrl: './new-bono.component.html',
  styleUrls: ['./new-bono.component.css']
})
export class NewBonoComponent implements OnInit {

  public invalid: boolean = true;

  bono={
    Nombre: "",
    Importancia: 0,
    VN: 0,
    VC: 0,
    Anios: 0,
    Periodo_Cupon_id: 1,
    DXA: 360,
    Tipo_Tasa: "Efectiva",
    Periodo_Capitalizacion_id: 2,
    P_Tasa_Interes: 0,
    P_Tasa_Anual_Descuento: 0,
    P_Impuesto: 0,
    Emision: Date.now(),
    P_Prima: 0,
    P_Estructuracion: 0,
    P_Colocacion: 0,
    P_Flotacion: 0,
    P_Cavali: 0,
    Tipo_Moneda: "$"
  }

  frecuencias! : Periodo[];

  inflacion: any;

  displayedColumns: string[] = ['Año', 'Inflación'];
  dataSource : any = [];


  constructor(private bonoService:BonoService, private router:Router, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getAllPeriodos();
  }

  crearBono(){

    const bonoreq = {
      nombre: this.bono.Nombre,
      importancia: this.bono.Importancia,
      vn: this.bono.VN,
      vc: this.bono.VC,
      anios: this.bono.Anios,
      periodo_cupon_id: this.bono.Periodo_Cupon_id,
      dxa: this.bono.DXA,
      tipo_tasa: this.bono.Tipo_Tasa,
      periodo_capitalizacion_id: this.bono.Periodo_Capitalizacion_id,
      p_tasa_interes: this.bono.P_Tasa_Interes,
      p_tasa_anual_descuento: this.bono.P_Tasa_Anual_Descuento,
      p_impuesto: this.bono.P_Impuesto,
      emision: new Date(this.bono.Emision),
      p_prima: this.bono.P_Prima,
      p_estructuracion: this.bono.P_Estructuracion,
      p_colocacion: this.bono.P_Colocacion,
      p_flotacion: this.bono.P_Flotacion,
      p_cavali: this.bono.P_Cavali,
      tipo_moneda: this.bono.Tipo_Moneda
    }
    const EmisionDate = String(this.bono.Emision).split("-").map(Number);
    bonoreq.emision.setFullYear(EmisionDate[0], EmisionDate[1], EmisionDate[2]);
    
    console.log(bonoreq);

    this.bonoService.createBono(bonoreq)
      .subscribe((x:any)=>{
        console.log(x);

        if(this.dataSource != null){
          for(let i = 0; i < this.dataSource.length; i++){
            this.inflacion = ({
              bonoId: x.id,
              anio: this.dataSource[i].anio,
              inflacion: this.dataSource[i].inflacion,
            });

            this.bonoService.createInflation(this.inflacion)
            .subscribe((x:any)=>{
            console.log(x);
            }, (error)=>{
            this.invalid = true;
            });
          }
        }

        let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.navigate([`/admin/bonos/calcular/${x.id}`]);
      }, (error)=>{
      this.invalid = true;
      });
  }

  agregarInflacion(){
    const dialogRef = this.dialog.open(NewInflacionComponent, {
      width: '500px',
      data: {Anio: null, Inflacion: null},
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed');
      if(result != undefined){
        let verificar = false;
        if(this.dataSource != null){
          for(let i = 0; i < this.dataSource.length; i++){
            if(result.anio == this.dataSource[i].anio){
              verificar = true;
            }
          }
        }

        if(verificar == false){
          this.dataSource.push(result);
          this.dataSource= [...this.dataSource];
        }
        else{
          this.openSnackBar("YA EXISTE UNA INFLACION PARA ESTE AÑO", "ERROR")
        }
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2 * 1000,
    });
  }

  eliminarInflacion(){
    this.dataSource.pop();
    this.dataSource= [...this.dataSource];
  }

  verif(){
    if(this.dataSource != null){
      if(this.dataSource.length > 0){
        return false;
      }
      else{
        return true;
      }
    }
    else{
      return false;
    }
  }

  verif2(){
    if(this.dataSource != null){
      if(this.dataSource.length != this.bono.Anios){
        return false;
      }
      else{
        return true;
      }
    }
    else{
      return false
    }
    
  }

  getAllPeriodos(){
    this.bonoService.getAllPeriodos().
    subscribe((x:any)=>{
      console.log(x);
      this.frecuencias = x;
    }, (error)=>{
    this.invalid = true;
    });
  }

}
