import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BonoService } from '../shared/bono.service';

@Component({
  selector: 'app-list-bono',
  templateUrl: './list-bono.component.html',
  styleUrls: ['./list-bono.component.css']
})
export class ListBonoComponent implements OnInit {

  userId!: any;
  constructor(private bonoService:BonoService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe( params =>{
      this.userId = params['id']
    });
  }

  getBonosUser(){

  }

}
