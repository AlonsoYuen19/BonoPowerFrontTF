import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Bono, BonoReq, InflacionReq, Periodo } from './bono.model';

@Injectable({
  providedIn: 'root'
})
export class BonoService {

  private apiBase: string = environment.apiBase;

  constructor(private http:HttpClient) { }

  getAll(id: number){
    return this.http.get<Bono[]>(`${this.apiBase}/bono/userId/${id}`)
  }

  createBono(bonoReq:BonoReq){
    return this.http.post(`${this.apiBase}/bono`, bonoReq)
  }

  getBonoById(id: number){
    return this.http.get<Bono>(`${this.apiBase}/bono/${id}`)
  }

  getPeriodoCuponById(id: number){
    return this.http.get<Periodo>(`${this.apiBase}/period/${id}`)
  }

  deleteBono(id: number){
    return this.http.delete(`${this.apiBase}/bono/${id}`)
  }

  createInflation(bonoReq:InflacionReq){
    return this.http.post(`${this.apiBase}/inflation`, bonoReq)
  }

  getAllPeriodos(){
    return this.http.get<Periodo[]>(`${this.apiBase}/period`)
  }

  getInflaciones(id: number){
    return this.http.get<Periodo[]>(`${this.apiBase}/inflation/bonoId/${id}`)
  }
}
