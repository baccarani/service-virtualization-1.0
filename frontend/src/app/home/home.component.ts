import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  imposterObject: any = [];
  viewDependency: any = ""; 
  viewDependencyName: string = "";  
  


  constructor(private http: HttpClient) { }

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

}
