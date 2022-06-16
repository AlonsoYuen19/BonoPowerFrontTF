import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InflacionReq } from '../shared/bono.model';

@Component({
  selector: 'app-new-inflacion',
  templateUrl: './new-inflacion.component.html',
  styleUrls: ['./new-inflacion.component.css']
})
export class NewInflacionComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NewInflacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

}
