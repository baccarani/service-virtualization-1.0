import { HttpClient } from "@angular/common/http";
import {
  Component,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormArray, FormBuilder } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { Predicate } from "../models/predicate";
import { Response } from "../models/response";
import { ImposterService } from "../services/imposter.service";
import { Stubs } from "../models/stubs";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PredicatesComponent } from "../predicates/predicates.component";
import { ResponsesComponent } from "../responses/responses.component";
import { jsonValidator } from "../shared/json-validator";

@Component({
  selector: "app-add-dependency",
  templateUrl: "./add-dependency.component.html",
  styleUrls: ["./add-dependency.component.css"],
})
export class AddDependencyComponent implements OnInit {
  @ViewChild("predicateComponent") predicateComponent: PredicatesComponent;
  @ViewChild("responsesComponent") responsesComponent: ResponsesComponent;
  protocols = ["http", "https", "tcp"];
  methods = ["GET", "POST", "PUT"];
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
            body: ["", [jsonValidator()]],
          })
        ])
      })
    ]),
  });

  isEditImposter: boolean = false;

  ngOnInit() {
    if (this.data && this.data.imposter) {
      // if we are editing an imposter
      this.isEditImposter = true;
      this.dependencyForm.patchValue({
        name: this.data.imposter.name,
        port: this.data.imposter.port,
        protocol: this.data.imposter.protocol,
        stubs: []
      });
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
                query: [""],
                headers: [null],
                body: [""]
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
              body: ["", [jsonValidator()]],
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
  }

  predicateUpdate(form: any) {
    this.showEdit[form.index] = true;
    this.predicates[form.index] = form.value;
  }

  closeModal() {
    this.matDialogRef.close();
  }

  onSubmit() {
    if (this.dependencyForm.invalid) {
      return;
    }
    if (this.isEditImposter) {
      this.predicateComponent.updatePredicates();
      this.responsesComponent.updateResponses();
      
      this.imposterService.onEditImposter(this.dependencyForm.value);
    } else {
      this.imposterService.onCreateImposter(this.dependencyForm.value);
    }
    this.matDialogRef.close();
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
            body: ["", [jsonValidator()]],
          })
        ])
      })
    );

    this.imposterService.onAddStub();
    this.stubs = this.imposterService.onGetStubs(); // can be refactored to use a behaviour subject for a future enhancement
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
        body: ["", [jsonValidator()]],
      })
    );
    this.imposterService.onAddResponse(stubID);
  }

  deleteStubUpdate(stubID: number, stubIndex: number) {
    (this.dependencyForm.get("stubs") as FormArray).removeAt(stubIndex);
    this.imposterService.onDeleteStub(stubID);
  }

  deletePredicateUpdate(predicateIndex: number, stubIndex: number) {
    ((this.dependencyForm.get("stubs") as FormArray).at(stubIndex).get("predicates") as FormArray).removeAt(predicateIndex);
    this.imposterService.onDeletePredicate(predicateIndex, stubIndex);
  }

  deleteResponseUpdate(responseIndex: number, stubIndex: number) {
    ((this.dependencyForm.get("stubs") as FormArray).at(stubIndex).get("responses") as FormArray).removeAt(responseIndex);
    this.imposterService.onDeleteResponse(responseIndex, stubIndex);
  }

  getPredicateFormGroup(stubIndex, predicateIndex) {
    return ((this.dependencyForm.get("stubs") as FormArray).at(stubIndex).get("predicates") as FormArray).at(predicateIndex);
  }

  getResponseFormGroup(stubIndex, responseIndex) {
    return ((this.dependencyForm.get("stubs") as FormArray).at(stubIndex).get("responses") as FormArray).at(responseIndex);
  }
}
