import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Predicate } from '../models/predicate';
import { Response } from '../models/response';
import { ImposterService } from '../services/imposter.service';
import { Stubs } from '../models/stubs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient, private fb: FormBuilder, private matDialogRef: MatDialogRef<AddDependencyComponent>, private imposterService: ImposterService) { }

  @Input() index: number = 0;
  indexStub: number = 0;
  indexPredicate: number = 0;
  indexResponse: number = 0;

  dependencyForm = this.fb.group({
    name: [''],
    port: [null],
    protocol: [''],
  });

  isEditImposter: boolean = false;

  ngOnInit() {
    if (this.data && this.data.imposter) { // if we are editing an imposter
      this.isEditImposter = true;
      this.dependencyForm.patchValue({
        name: this.data.imposter.name,
        port: this.data.imposter.port,
        protocol: this.data.imposter.protocol
      });

      this.imposterService.onResetStubs();
      this.stubs = this.imposterService.onGetStubs();

      this.data.imposter.stubs.forEach(stub => {
        let tempPredicates = []
        let tempResponses = []
        stub.predicates.forEach(operator => {
          let keys = Object.keys(operator);

          if (keys.length > 0 && keys[0] === 'not') {
            const predicate = {
              operator: 'not',
              method: operator.not.equals.method,
              path: operator.not.equals.path,
              query: JSON.stringify(operator.not.equals.query).replace(/\"([^(\")"]+)\":/g, "$1:"),
            }
            tempPredicates.push(predicate);
          } else {
            const predicate = {
              operator: keys[0],
              method: operator[keys[0]].method,
              path: operator[keys[0]].path,
              query: JSON.stringify(operator[keys[0]].query), // turning into a string to display it in the form on the UI
            }
            tempPredicates.push(predicate);
          }
        })

        stub.responses.forEach(data => {
          const response = {
            statusCode: data.is.statusCode,
            headers: data.is.headers,
            body: JSON.stringify(data.is.body),
          }
          tempResponses.push(response);
        })

        const tempStubs = { stubID: Date.now(), predicates: tempPredicates, responses: tempResponses }
        this.stubs.push(tempStubs);
      })
    } else {
      this.imposterService.onResetStubs();
      this.imposterService.setDefaultStubs();
      this.stubs = this.imposterService.onGetStubs();
    }
  }

  predicateUpdate(form: any) {
    this.showEdit[form.index] = true;
    this.predicates[form.index] = form.value;
  }

  closeModal() {
    this.matDialogRef.close();
  }

  onSubmit() {
    if (this.isEditImposter) {
      this.imposterService.onEditImposter(this.dependencyForm.value);
    } else {
      this.imposterService.onCreateImposter(this.dependencyForm.value);
    }
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