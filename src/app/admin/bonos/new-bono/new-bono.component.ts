import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NewInflacionComponent } from '../new-inflacion/new-inflacion.component';
import { InflacionReq } from '../shared/bono.model';
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
    Plazo_Gracia: 0,
    DXA: 0,
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
  }

  frecuencias = [
    {
      id: 1,
      nombre: "Mensual",
      dias: 30
    },
    {
      id: 2,
      nombre: "Bimestral",
      dias: 60
    },
    {
      id: 3,
      nombre: "Trimestral",
      dias: 90
    },
    {
      id: 4,
      nombre: "Cuatrimestral",
      dias: 120
    },
    {
      id: 5,
      nombre: "Semestral",
      dias: 180
    },
    {
      id: 6,
      nombre: "Anual",
      dias: 360
    }
  ]

  inflaciones: InflacionReq[] = [
    {
      Anio: 1,
      Inflacion: 0.01
    },
    {
      Anio: 2,
      Inflacion: 0.02
    },
    {
      Anio: 3,
      Inflacion: 0.03
    },
    {
      Anio: 4,
      Inflacion: 0.04
    },
    {
      Anio: 5,
      Inflacion: 0.05
    }
  ]

  inflacion: any

  displayedColumns: string[] = ['Año', 'Inflación'];
  dataSource = this.inflaciones;


  constructor(private bonoService:BonoService, private router:Router, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  crearBono(){

    const bonoreq = {
      Nombre: this.bono.Nombre,
      Importancia: this.bono.Importancia,
      VN: this.bono.VN,
      VC: this.bono.VC,
      Anios: this.bono.Anios,
      Periodo_Cupon_id: this.bono.Periodo_Cupon_id,
      Plazo_Gracia: this.bono.Plazo_Gracia,
      DXA: this.bono.DXA,
      Tipo_Tasa: this.bono.Tipo_Tasa,
      Periodo_Capitalizacion_id: this.bono.Periodo_Capitalizacion_id,
      P_Tasa_Interes: this.bono.P_Tasa_Interes,
      P_Tasa_Anual_Descuento: this.bono.P_Tasa_Anual_Descuento,
      P_Impuesto: this.bono.P_Impuesto,
      Emision: new Date(this.bono.Emision),
      P_Prima: this.bono.P_Prima,
      P_Estructuracion: this.bono.P_Estructuracion,
      P_Colocacion: this.bono.P_Colocacion,
      P_Flotacion: this.bono.P_Flotacion,
      P_Cavali: this.bono.P_Cavali,
    }

    const EmisionDate = String(this.bono.Emision).split("-").map(Number);
    bonoreq.Emision.setFullYear(EmisionDate[0], EmisionDate[1], EmisionDate[2]);

    this.bonoService.createBono(bonoreq)
      .subscribe((x:any)=>{
        console.log(x);
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
        for(let i = 0; i < this.dataSource.length; i++){
          if(result.Anio == this.dataSource[i].Anio){
            verificar = true;
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
    if(this.dataSource.length > 0){
      return false;
    }
    else{
      return true;
    }
  }

  verif2(){
    if(this.dataSource.length != 6){
      return false;
    }
    else{
      return true;
    }
  }

}
