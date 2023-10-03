import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Predicate } from '../models/predicate';
import { Response } from '../models/response';
import { ImposterService } from '../services/imposter.service';
import { Stubs } from '../models/stubs';

@Component({
  selector: 'app-add-dependency',
  templateUrl: './add-dependency.component.html',
  styleUrls: ['./add-dependency.component.css']
})
export class AddDependencyComponent implements OnInit {
  protocols = ['http', 'https', 'tcp']
  methods = ['GET', 'POST', 'PUT']
  stubs: Stubs[] = [];
  predicates: Predicate[] = [];
  responses: Response[] = [];
  showEdit: boolean[] = [];
  @Output() hideCloseButton: boolean = true;

  constructor(private http: HttpClient, private fb: FormBuilder,private matDialogRef: MatDialogRef<AddDependencyComponent>, private imposterService: ImposterService) { }

  @Input() index: number = 0;
  indexStub: number = 0;
  indexPredicate: number = 0;
  indexResponse: number = 0;

  dependencyForm = this.fb.group({
    name: [''],
    port: [''],
    protocol: [''],
  });

  ngOnInit(): void {
    this.imposterService.onResetPredicates();
    this.imposterService.onResetResponses();
    this.imposterService.onResetStubs();

    if (this.imposterService.onGetPredicates().length === 0) {
      this.imposterService.onAddPredicate({operator: '', method: '', path: '', newpath: '', data: '', newOperator: '', query: ''}, this.indexPredicate)
      this.indexPredicate++;
    }

    if (this.imposterService.onGetResponses().length === 0) {
      this.imposterService.onAddResponse({statusCode: '', headers: '', body: ''}, this.indexResponse);
      this.indexResponse++;
    }

    if (this.imposterService.onGetStubs().length === 0) {
      this.imposterService.onAddStub({predicates: [], responses: []}, 0);
      this.indexStub++;
    }

    this.predicates = this.imposterService.onGetPredicates();
    this.responses = this.imposterService.onGetResponses();
    this.stubs = this.imposterService.onGetStubs();
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

  addStub() {
    const newStub = {
      predicates: [
        [{
          operator: '',
          method: '',
          path: '',
          newpath: '',
          data: '',
          newOperator: '',
          query: ''
        }]
      ],
      responses: [
        [{
          statusCode: '',
          headers: '',
          body: ''
        }]
      ]
    };

    this.imposterService.onAddStub(newStub, this.indexStub);
    this.indexStub++;
    this.stubs = this.imposterService.onGetStubs();
  }

  addPredicate() {
    this.imposterService.onAddPredicate({operator: '', method: '', path: '', newpath: '', data: '', newOperator: '', query: ''}, this.indexPredicate);
    this.indexPredicate++;
    this.showEdit.push(false);
    this.predicates = this.imposterService.onGetPredicates();
  }

  addResponse() {
    this.imposterService.onAddResponse({statusCode: '', headers: '', body: ''}, this.indexResponse);
    this.indexResponse++;
    this.showEdit.push(false);
    this.responses = this.imposterService.onGetResponses();

    // if (this.imposterService.onGetResponses().length > 1) {
    //   this.hideCloseButton = false;
    // } else {
    //   this.hideCloseButton = true;
    // }
  }

  deleteStubUpdate(stubIndex: any): void {
    this.indexStub--;
    let tempStubs: Stubs[] = [];
    for (let i = 0; i < this.stubs.length; i++) {
      if (i !== stubIndex) {
        tempStubs.push(this.stubs[i]);
      }
    }
    this.stubs = tempStubs;

    let tempEdit: boolean[] = [];
    for (let i = 0; i < this.showEdit.length; i++) {
      if (i !== stubIndex) {
        tempEdit.push(this.showEdit[i]);
      }
    }
    this.showEdit = tempEdit;

    this.imposterService.onDeleteStub(stubIndex);
  }

  deletePredicateUpdate(index: any): void {
    this.indexPredicate--;
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

  deleteResponseUpdate(responseIndex: any): void {
    this.indexResponse--;
    let tempResponses: Response[] = [];
    for (let i = 0; i < this.responses.length; i++) {
      if (i !== responseIndex) {
        tempResponses.push(this.responses[i]);
      }
    }
    this.responses = tempResponses;

    let tempEdit: boolean[] = [];
    for (let i = 0; i < this.showEdit.length; i++) {
      if (i !== responseIndex) {
        tempEdit.push(this.showEdit[i]);
      }
    }
    this.showEdit = tempEdit;

    this.imposterService.onDeleteResponse(responseIndex);
  }

  onDelete() {
    this.deletePredicateUpdate(this.index);
  }

  // onDeleteResponse() {
  //   this.deleteResponseUpdate(this.indexResponse);
  // }
}