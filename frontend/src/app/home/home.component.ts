import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AddDependencyComponent } from '../add-dependency/add-dependency.component';
import { ImposterService } from '../services/imposter.service';
import { Store } from '@ngrx/store'
import * as ImposterActions from '../store/imposter.actions'
import { Clipboard } from '@angular/cdk/clipboard'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  imposterArray: any[] = [];
  viewDependency: any = '';
  viewDependencyName: string = '';
  isCopyAll = false;
  copyAllButtonText = 'Copy All';
  iconName = 'file_copy';
  copyAllButtonColor = 'black';


  constructor(private http: HttpClient,
    private matDialogModule: MatDialog,
    private imposterService: ImposterService,
    private store: Store<{ imposter: {} }>,
    private clipboard: Clipboard) { }

  ngOnInit(): void {
    // use services to load data and state
    this.imposterService.onGetImposter().subscribe(data => {
      this.imposterArray = data;
    })

    // use store and dispatch to load imposters with http
    this.store.dispatch(new ImposterActions.AddImposter(this.imposterArray));

    // get initial state from ngrx
    let x = this.store.select('imposter');
    x.subscribe(data => {
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

  onCopyAll() {
    this.clipboard.copy(JSON.stringify(this.imposterArray));
    this.copyAllButtonText = 'Copied!';
    this.iconName = 'done';
    this.copyAllButtonColor = 'green';
    setTimeout(() => {
      this.copyAllButtonText = 'Copy All';
      this.iconName = 'file_copy';
      this.copyAllButtonColor = 'black';
    }, 2000);
  }

  openPostman(data){
    console.log('clicked');
    window.open('postman://app', '_blank');
    //response for selected imposter
    this.imposterService.onViewImposter(data).subscribe((res) => {
      console.log(res);
    });
  }
}
