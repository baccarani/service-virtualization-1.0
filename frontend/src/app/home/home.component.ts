import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AddDependencyComponent } from '../add-dependency/add-dependency.component';
import { ImposterService } from '../services/imposter.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  imposterObject: any[] = [];
  viewDependency: any = '';
  viewDependencyName: string = '';



  constructor(private http: HttpClient, private matDialogModule: MatDialog, private imposterService: ImposterService) { }

  ngOnInit(): void {
    this.imposterService.onGetImposter()
      .subscribe(data => {
        this.imposterObject = data;
      })
  }

  onViewImposter(data) {
    this.imposterService.onViewImposter(data).subscribe(responseData => {
      this.viewDependency = responseData;
      this.viewDependencyName = this.viewDependency.name;
    })
  }

  onAddImposter() {
    this.matDialogModule.open(AddDependencyComponent);
  }

  onDeleteImposter(port, index) {
    this.imposterService.onDeleteImposter(port, index);
    this.viewDependency = '';
    this.viewDependencyName = '';
  }

}
