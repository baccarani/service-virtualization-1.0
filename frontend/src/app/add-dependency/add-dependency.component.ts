import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Predicate } from '../models/predicate';
import { ImposterService } from '../services/imposter.service';

@Component({
  selector: 'app-add-dependency',
  templateUrl: './add-dependency.component.html',
  styleUrls: ['./add-dependency.component.css']
})
export class AddDependencyComponent implements OnInit {
  protocols = ['http', 'https', 'tcp']
  methods = ['GET', 'POST', 'PUT']
  stubs = []
  predicates: Predicate[] = []
  showEdit: boolean[] = [];


  constructor(private http: HttpClient, private matDialogRef: MatDialogRef<AddDependencyComponent>, private imposterService: ImposterService) { }

  ngOnInit(): void {
    this.imposterService.onResetPredicates()
    if (this.imposterService.onGetPredicates().length === 0) {
      this.imposterService.onAddPredicate({method: '', path: ''})
    }
    this.predicates = this.imposterService.onGetPredicates();
  }

  predicateUpdate(form: any): void {
    this.showEdit[form.index] = true;
    this.predicates[form.index] = form.value;
    // console.log(this.predicates);
  }


  closeModal() {
    this.matDialogRef.close();
  }


  onSubmit(data) {
    this.imposterService.onCreateImposter(data);
    this.matDialogRef.close();
  }

  addPredicate() {
    this.imposterService.onAddPredicate({method: '', path: ''})
    this.showEdit.push(false);
    this.predicates = this.imposterService.onGetPredicates();
  }

  deleteUpdate(index: any): void {
    let tempPredicates: Predicate[] = [];
    for (let i = 0; i < this.predicates.length; i++) {
      if (i !== index) {
        tempPredicates.push(this.predicates[i]);
      }
    }
    this.predicates = tempPredicates;

    let tempEdit: boolean[] = [];
    for (let i = 0; i < this.showEdit.length; i++) {
      if (i !== index) {
        tempEdit.push(this.showEdit[i]);
      }
    }
    this.showEdit = tempEdit;

    this.imposterService.onDeletePredicate(index);
  }


  // onAddDependency(data) {

  //   const method = data.method;

  //   this.stubs = [{
  //     "predicates": [
  //       {
  //         "equals": {
  //           "method": method,
  //           "path": "/customers/123"
  //         }
  //       }
  //     ],
  //     "responses": [
  //       {
  //         "is": {
  //           "statusCode": 201,
  //           "headers": {
  //             "Location": "http://localhost:4545/customers/123",
  //             "Content-Type": "application/xml"
  //           },
  //           "body": "<customer><email>customer@test.com</email></customer>"
  //         }
  //       },
  //       {
  //         "is": {
  //           "statusCode": 400,
  //           "headers": {
  //             "Content-Type": "application/xml"
  //           },
  //           "body": "<error>email already exists</error>"
  //         }
  //       }
  //     ]
  //   },
  //   {
  //     "responses": [
  //       {
  //         "is": { "statusCode": 404 }
  //       }
  //     ]
  //   }
  //   ];

  //   data = { ...data, stubs: this.stubs };

  //   this.imposterService.onAddImposter(data);
  //   this.matDialogRef.close();

  // }

}
