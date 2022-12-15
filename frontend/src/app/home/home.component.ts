import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AddDependencyComponent } from '../add-dependency/add-dependency.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  imposterObject: any = [];
  viewDependency: any = ""; 
  viewDependencyName: string = "";
  data = {protocol: "https", port: 5010};  
  


  constructor(private http: HttpClient, private matDialogModule: MatDialog) { }

  ngOnInit(): void {

    this.http
      .get(`http://localhost:5000/imposters`)
      .subscribe(data => {
        this.imposterObject = data;
        this.imposterObject = this.imposterObject.imposters;
      })
  }

  onViewImposter(data) {
    this.http
    .get(`http://localhost:5000/imposters/${data}`)
      .subscribe(data => {
        this.viewDependency = data;
        this.viewDependencyName = this.viewDependency.name
      })
  }

  onAddImposter() {
    this.matDialogModule.open(AddDependencyComponent);
  }

  onDeleteImposter(data) {
    this.http
    .delete(`http://localhost:5000/imposters/${data}`)
      .subscribe(data => {
      })
  }

}
