import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ImposterService } from '../services/imposter.service';

@Component({
  selector: 'app-add-dependency',
  templateUrl: './add-dependency.component.html',
  styleUrls: ['./add-dependency.component.css']
})
export class AddDependencyComponent implements OnInit {

  constructor(private http: HttpClient, private matDialogRef: MatDialogRef<AddDependencyComponent>, private imposterService: ImposterService) { }

  ngOnInit(): void {
  }


  closeModal() {
    this.matDialogRef.close();

  }


  onAddDependency(data) {
    this.imposterService.onAddImposter(data)
    this.matDialogRef.close();


  }

}
