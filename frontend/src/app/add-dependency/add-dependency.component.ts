import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-dependency',
  templateUrl: './add-dependency.component.html',
  styleUrls: ['./add-dependency.component.css']
})
export class AddDependencyComponent implements OnInit {

  constructor(private http: HttpClient, private matDialogRef: MatDialogRef<AddDependencyComponent>) { }

  ngOnInit(): void {
  }


  closeModal() {
    this.matDialogRef.close();

  }


  onAddDependency(data) {
    console.log(data);
    this.http
      .post(`http://localhost:5000/imposters`, data)
      .subscribe(responseData => {
        console.log(responseData);
      });
      this.matDialogRef.close();


  }

}
