import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-dependency',
  templateUrl: './add-dependency.component.html',
  styleUrls: ['./add-dependency.component.css']
})
export class AddDependencyComponent implements OnInit {

  constructor(private matDialogRef: MatDialogRef<AddDependencyComponent>) { }

  ngOnInit(): void {
  }


  closeModal() {
    this.matDialogRef.close();
  }


  onAddDependency(data) {

  }

}
