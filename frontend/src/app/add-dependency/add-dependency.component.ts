import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
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



  statusCode = [
    'Informational responses (100 to 199)',
    'Successful responses (200 to 299)',
    'Redirection messages (300 to 399)',
    'Client error responses (400 to 499)',
    'Server error responses (500 to 599)',
  ];

  informationRes = [ 
    '100',
    '101',
    '102',
    '103',
  ];

  successRes = [
    '200',
    '201',
    '202',
    '203',
    '204',
    '205',
    '206',
    '207',
    '208',
    '226',
  ];

  redirectionRes = [
    '300',
    '301',
    '302',
    '303',
    '304',
    '305',
    '306',
    '307',
    '308',
  ];

  clientErrRes = [
    '400',
    '401',
    '402',
    '403',
    '404',
    '405',
    '406',
    '407',
    '408',
    '409',
    '410',
    '411',
    '412',
    '413',
    '414',
    '415',
    '416',
    '417',
    '418',
    '421',
    '422',
    '423',
    '424',
    '425',
    '426',
    '428',
    '429',
    '431',
    '451',
  ];

  serverErrRes = [
    '500',
    '501',
    '502',
    '503',
    '504',
    '505',
    '506',
    '507',
    '508',
    '510',
    '511',
  ];


  constructor(private http: HttpClient, private fb: FormBuilder,private matDialogRef: MatDialogRef<AddDependencyComponent>, private imposterService: ImposterService) { }

  dependencyForm = this.fb.group({
    name: [''],
    port: [''],
    protocol: [''],
    statusCode: [''],
    infoCode: [''],
    successCode: [''], 
    redirectCode: [''],
    clientCode: [''],
    serverCode: [''],
    headers: [''],
    body: ['']
  });

  ngOnInit(): void {
    this.imposterService.onResetPredicates()
    if (this.imposterService.onGetPredicates().length === 0) {
      this.imposterService.onAddPredicate({operator: '', method: '', path: '', data: '', newOperator: '', query: ''})
    }
    this.predicates = this.imposterService.onGetPredicates();
  }

  predicateUpdate(form: any): void {
    this.showEdit[form.index] = true;
    this.predicates[form.index] = form.value;
  }


  closeModal() {
    this.matDialogRef.close();
  }


  onSubmit() {
    this.imposterService.onCreateImposter(this.dependencyForm.value);
    this.matDialogRef.close();
  }

  addPredicate() {
    this.imposterService.onAddPredicate({operator: '', method: '', path: '', data: '', newOperator: '', query: ''})
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

}
