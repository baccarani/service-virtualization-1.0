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
  protocols = ['http', 'https', 'tcp'];
  methods = ['GET', 'POST', 'PUT'];
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

  ngOnInit() {
    this.imposterService.onResetStubs();
    this.imposterService.setDefaultStubs();
    this.stubs = this.imposterService.onGetStubs();
  }

  predicateUpdate(form: any) {
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
    this.imposterService.onAddStub();
    this.stubs = this.imposterService.onGetStubs(); // can be refactored to use a behaviour subject for a future enhancement
  }

  addPredicate(stubID: number) {
    this.imposterService.onAddPredicate(stubID);
  }

  addResponse(stubID: number) {
    this.imposterService.onAddResponse(stubID);
  }

  deleteStubUpdate(stubID: number) {
    this.imposterService.onDeleteStub(stubID);
  }

  deletePredicateUpdate(predicateIndex: number, stubIndex: number) {
    this.imposterService.onDeletePredicate(predicateIndex, stubIndex);
  }

  deleteResponseUpdate(responseIndex: number, stubIndex: number) {
    this.imposterService.onDeleteResponse(responseIndex, stubIndex);
  }
}