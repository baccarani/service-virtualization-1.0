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
  protocols = ['http', 'https', 'tcp']
  methods = ['GET', 'POST', 'PUT']
  stubs = []


  constructor(private http: HttpClient, private matDialogRef: MatDialogRef<AddDependencyComponent>, private imposterService: ImposterService) { }

  ngOnInit(): void { }


  closeModal() {
    this.matDialogRef.close();
  }


  onSubmit(data) {
    this.imposterService.createImposter(data);
    this.matDialogRef.close();
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
