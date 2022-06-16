import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Bono, BonoReq, Periodo } from './bono.model';

@Injectable({
  providedIn: 'root'
})
export class BonoService {

  private apiBase: string = environment.apiBase;

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<Bono[]>(`${this.apiBase}/bonos/listar`)
  }

  createBono(bonoReq:BonoReq){
    return this.http.post(`${this.apiBase}/bonos/agregar`, bonoReq)
  }

  getBonoById(id: number){
    return this.http.get<Bono>(`${this.apiBase}/bonos/${id}`)
  }

  getPeriodoCuponById(id: number){
    return this.http.get<Periodo>(`${this.apiBase}/periodos/${id}`)
  }

  deleteBono(id: number){
    return this.http.delete(`${this.apiBase}/bonos/${id}`)
  }
}
