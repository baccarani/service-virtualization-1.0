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
  @Input() indexResponse: number = 0;

  dependencyForm = this.fb.group({
    name: [''],
    port: [''],
    protocol: [''],
  });

  ngOnInit(): void {
    this.imposterService.onResetPredicates();
    this.imposterService.onResetResponses();
    
    if (this.imposterService.onGetPredicates().length === 0) {
      this.imposterService.onAddPredicate({operator: '', method: '', path: '', newpath: '', data: '', newOperator: '', query: ''}, this.index)
    }

    if (this.imposterService.onGetResponses().length === 0) {
      this.imposterService.onAddResponse({statusCode: '', headers: '', body: ''})
    }

    this.predicates = this.imposterService.onGetPredicates();
    this.responses = this.imposterService.onGetResponses();
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
    this.imposterService.onAddPredicate({operator: '', method: '', path: '', newpath: '', data: '', newOperator: '', query: ''}, this.index)
    this.showEdit.push(false);
    this.predicates = this.imposterService.onGetPredicates();
    // add stub
  }

  addStub() {
    this.imposterService.onAddStub({predicates: [], responses: []}, this.index);
    this.stubs = this.imposterService.onGetStubs();
  }

  addResponse() {
    this.imposterService.onAddResponse({statusCode: '', headers: '', body: ''})
    this.showEdit.push(false);
    this.responses = this.imposterService.onGetResponses();
    if (this.imposterService.onGetResponses().length > 1) {
      this.hideCloseButton = false;
    } else {
      this.hideCloseButton = true;
    }
  }

  addPredicatesResponses() {
    // this.imposterService.onAddPredicate({operator: '', method: '', path: '', newpath: '', data: '', newOperator: '', query: ''})
    // this.imposterService.onAddResponse({statusCode: '', headers: '', body: ''})
    // this.showEdit.push(false);
    // this.predicates = this.imposterService.onGetPredicates();
    // this.responses = this.imposterService.onGetResponses();
    // if (this.imposterService.onGetResponses().length > 1) {
    //   this.hideCloseButton = false;
    // } else {
    //   this.hideCloseButton = true;
    // }
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

  deleteResponseUpdate(responseIndex: any): void {
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
    this.deleteUpdate(this.index);
  }

  onDeleteResponse() {
    this.deleteResponseUpdate(this.indexResponse);
  }

  onDeletePredicatesResponses() {
    
  }
}