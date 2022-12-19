import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AddDependencyComponent } from '../add-dependency/add-dependency.component';
import { ImposterService } from '../services/imposter.service';
import { Store } from '@ngrx/store'
import * as ImposterActions from '../store/imposter.actions'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  imposterArray: any[] = [];
  viewDependency: any = '';
  viewDependencyName: string = '';



  constructor(private http: HttpClient,
    private matDialogModule: MatDialog,
    private imposterService: ImposterService,
    private store: Store<{ imposter: {} }>) { }

  ngOnInit(): void {
    // use store and dispatch to load imposters with http
    this.imposterService.onGetImposter()
      .subscribe(data => {
        console.log(data);
        this.imposterArray = data;
      })
    this.store.dispatch(new ImposterActions.AddImposter(this.imposterArray));

    // get initial state from ngrx
    let x = this.store.select('imposter');
    x.subscribe(data => {
      console.log(data);
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
