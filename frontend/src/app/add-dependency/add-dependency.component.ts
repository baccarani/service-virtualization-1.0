import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { Predicate } from "../models/predicate";
import { Response } from "../models/response";
import { ImposterService } from "../services/imposter.service";
import { Stubs } from "../models/stubs";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { jsonValidator } from "../shared/json-validator";
import { take } from "rxjs/operators";

@Component({
  selector: "app-add-dependency",
  templateUrl: "./add-dependency.component.html",
  styleUrls: ["./add-dependency.component.css"],
})
export class AddDependencyComponent implements OnInit {
  protocols = ["http", "https", "tcp"];
  //methods = ["GET", "POST", "PUT"]; //unused
  stubs: Stubs[] = [];
  predicates: Predicate[] = [];
  responses: Response[] = [];
  showEdit: boolean[] = [];
  @Output() hideCloseButton: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<AddDependencyComponent>,
    private imposterService: ImposterService,
    private cdRef: ChangeDetectorRef
  ) {}

  @Input() index: number = 0;
  indexStub: number = 0;
  indexPredicate: number = 0;
  indexResponse: number = 0;

  dependencyForm = this.fb.group({
    name: [""],
    port: [null],
    protocol: [""],
    stubs: this.fb.array([
      this.fb.group({
        predicates: this.fb.array([
          this.fb.group({
            operator: [""],
            method: [""],
            path: [""],
            newPath: [""],
            data: [""],
            newOperator: [""],
            query: [""],
            headers: [null],
            body: [""]
          })
        ]),
        responses: this.fb.array([
          this.fb.group({
            statusCode: [""],
            infoCode: [""],
            successCode: [""],
            redirectCode: [""],
            clientCode: [""],
            serverCode: [""],
            headers: [null],
            body: ["", [Validators.required, jsonValidator()]],
          })
        ])
      })
    ], Validators.required),
  });

  isEditImposter: boolean = false;
  errorMessage = '';

  ngOnInit() {
    if (this.data && this.data.imposter) {
      // if we are editing an imposter
      this.isEditImposter = true;
      this.dependencyForm.patchValue({
        name: this.data.imposter.name,
        port: this.data.imposter.port,
        protocol: this.data.imposter.protocol,
      });
      this.dependencyForm.controls.stubs.clear();
      this.dependencyForm.get('protocol').disable();

      this.imposterService.onResetStubs();
      this.stubs = this.imposterService.onGetStubs();

      this.data.imposter.stubs.forEach((stub, stubIndex) => {
        (this.dependencyForm.get("stubs") as FormArray).push(
          this.fb.group({
            predicates: this.fb.array([]),
            responses: this.fb.array([])
          })
        );

        const tempPredicates = [];
        const tempResponses = [];
        const control = ["", [Validators.required, jsonValidator()]];
        stub.predicates.forEach((operator) => {
          const keys = Object.keys(operator);

          if (keys.length > 0 && keys[0] === "not") {
            const predicate = {
              operator: "not",
              method: operator.not.equals.method,
              path: operator.not.equals.path,
              query: JSON.stringify(operator.not.equals.query),
              headers: operator.not.equals.headers,
              body: JSON.stringify(operator.not.equals.body)
            };
            tempPredicates.push(predicate);

            ((this.dependencyForm.get("stubs") as FormArray).at(stubIndex).get("predicates") as FormArray).push(
              this.fb.group({
                operator: [""],
                method: [""],
                path: [""],
                newPath: [""],
                data: [""],
                newOperator: [""],
                query: (operator.not.equals.method === 'GET' || operator.not.equals.method === 'DELETE') ? control : [""],
                headers: [null],
                body: (operator.not.equals.method === 'POST' || operator.not.equals.method === 'PUT' || operator.not.equals.method === 'PATCH') ? control : [""],
              })
            );
          } else {
            const predicate = {
              operator: keys[0],
              method: operator[keys[0]].method,
              path: operator[keys[0]].path,
              query: JSON.stringify(operator[keys[0]].query), // turning into a string to display it in the form on the UI
              headers: operator[keys[0]].headers,
              body: JSON.stringify(operator[keys[0]].body)
            };
            tempPredicates.push(predicate);

            ((this.dependencyForm.get("stubs") as FormArray).at(stubIndex).get("predicates") as FormArray).push(
              this.fb.group({
                operator: [""],
                method: [""],
                path: [""],
                newPath: [""],
                data: [""],
                newOperator: [""],
                query: (operator[keys[0]].method === 'GET' || operator[keys[0]].method === 'DELETE') ? control : [""],
                headers: [null],
                body: (operator[keys[0]].method === 'POST' || operator[keys[0]].method === 'PUT' || operator[keys[0]].method === 'PATCH') ? control : [""],
              })
            );
          }
        });

        stub.responses.forEach((data) => {
          const response = {
            statusCode: data.is.statusCode,
            headers: data.is.headers,
            body: JSON.stringify(data.is.body),
          };
          tempResponses.push(response);

          ((this.dependencyForm.get("stubs") as FormArray).at(stubIndex).get("responses") as FormArray).push(
            this.fb.group({
              statusCode: [""],
              infoCode: [""],
              successCode: [""],
              redirectCode: [""],
              clientCode: [""],
              serverCode: [""],
              headers: [null],
              body: ["", [Validators.required, jsonValidator()]],
            })
          );
        });

        const tempStubs = {
          stubID: Date.now(),
          predicates: tempPredicates,
          responses: tempResponses,
        };
        this.stubs.push(tempStubs);
      });
    } else {
      this.imposterService.onResetStubs();
      this.imposterService.setDefaultStubs();
      this.stubs = this.imposterService.onGetStubs();
    }
    this.cdRef.detectChanges();
  }

  predicateUpdate(form: any) {
    this.showEdit[form.index] = true;
    this.predicates[form.index] = form.value;
  }

  closeModal() {
    this.errorMessage = '';
    this.matDialogRef.close();
  }

  onSubmit() {
    this.errorMessage = '';
    if (this.dependencyForm.invalid) {
      return;
    }

    const imposterChange$ = this.isEditImposter 
      ? this.imposterService.onEditImposter(this.dependencyForm.value)
      : this.imposterService.onCreateImposter(this.dependencyForm.value);
    imposterChange$.pipe(take(1)).subscribe(
      () => {
        this.imposterService.updateImposterArray.next();
        this.matDialogRef.close();
      },
      (error) => {
        this.errorMessage = 'Failed to ' + (this.isEditImposter ? 'edit' : 'create') + ' imposter.';
        console.error(error);
      },
    );
  }

  addStub() {
    (this.dependencyForm.get("stubs") as FormArray).push(
      this.fb.group({
        predicates: this.fb.array([
          this.fb.group({
            operator: [""],
            method: [""],
            path: [""],
            newPath: [""],
            data: [""],
            newOperator: [""],
            query: [""],
            headers: [null],
            body: [""]
          })
        ]),
        responses: this.fb.array([
          this.fb.group({
            statusCode: [""],
            infoCode: [""],
            successCode: [""],
            redirectCode: [""],
            clientCode: [""],
            serverCode: [""],
            headers: [null],
            body: ["", [Validators.required, jsonValidator()]],
          })
        ])
      })
    );

    this.imposterService.onAddStub();
    this.stubs = this.imposterService.onGetStubs(); // can be refactored to use a behaviour subject for a future enhancement
    this.cdRef.detectChanges();
  }

  addPredicate(stubID: number, stubIndex: number) {
    ((this.dependencyForm.get("stubs") as FormArray).at(stubIndex).get("predicates") as FormArray).push(
      this.fb.group({
        operator: [""],
        method: [""],
        path: [""],
        newPath: [""],
        data: [""],
        newOperator: [""],
        query: [""],
        headers: [null],
        body: [""]
      })
    );
    this.imposterService.onAddPredicate(stubID);
    this.cdRef.detectChanges();
  }

  addResponse(stubID: number, stubIndex: number) {
    ((this.dependencyForm.get("stubs") as FormArray).at(stubIndex).get("responses") as FormArray).push(
      this.fb.group({
        statusCode: [""],
        infoCode: [""],
        successCode: [""],
        redirectCode: [""],
        clientCode: [""],
        serverCode: [""],
        headers: [null],
        body: ["", [Validators.required, jsonValidator()]],
      })
    );
    this.imposterService.onAddResponse(stubID);
    this.cdRef.detectChanges();
  }

  deleteStubUpdate(stubID: number, stubIndex: number) {
    (this.dependencyForm.get("stubs") as FormArray).removeAt(stubIndex);
    this.imposterService.onDeleteStub(stubID);
    this.cdRef.detectChanges();
  }

  deletePredicateUpdate(predicateIndex: number, stubIndex: number) {
    ((this.dependencyForm.get("stubs") as FormArray).at(stubIndex).get("predicates") as FormArray).removeAt(predicateIndex);
    this.imposterService.onDeletePredicate(predicateIndex, stubIndex);
    this.cdRef.detectChanges();
  }

  deleteResponseUpdate(responseIndex: number, stubIndex: number) {
    ((this.dependencyForm.get("stubs") as FormArray).at(stubIndex).get("responses") as FormArray).removeAt(responseIndex);
    this.imposterService.onDeleteResponse(responseIndex, stubIndex);
    this.cdRef.detectChanges();
  }

  getPredicateFormGroup(stubIndex, predicateIndex) {
    return ((this.dependencyForm.get("stubs") as FormArray).at(stubIndex).get("predicates") as FormArray).at(predicateIndex);
  }

  getResponseFormGroup(stubIndex, responseIndex) {
    return ((this.dependencyForm.get("stubs") as FormArray).at(stubIndex).get("responses") as FormArray).at(responseIndex);
  }
}
