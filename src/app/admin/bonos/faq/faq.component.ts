import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BonoService } from '../shared/bono.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FAQComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

}
