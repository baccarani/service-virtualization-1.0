import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Predicate } from "../models/predicate";
import { ImposterService } from "../services/imposter.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { CommonService } from "../services/common.service";
import { HEADERS } from "../models/constants";
import { jsonValidator } from "../shared/json-validator";

@Component({
  selector: "app-predicates",
  templateUrl: "./predicates.component.html",
  styleUrls: ["./predicates.component.css"],
})
export class PredicatesComponent implements OnInit {
  @ViewChild("options") options: ElementRef;
  @Input() predicateIndex: number = 0;
  @Input() predicate: Predicate = {
    operator: "",
    method: "",
    path: "",
    newPath: "",
    data: "",
    newOperator: "",
    query: "",
    headers: null,
    body: ""
  };
  @Input() showEdit: boolean = false;
  @Input() protocol: string;
  @Input() port: number;
  @Output() beneficiaryUpdate = new EventEmitter();
  @Output() editUpdate = new EventEmitter();
  @Output() deleteUpdate = new EventEmitter();
  @Input() isEditImposter: boolean = false;
  @Input() predicateForm: FormGroup;

  genericPath = ["/customer", "/user", "other"];
  headers = HEADERS;

  operator = [
    { name: "equals" },
    { name: "deepEquals" },
    { name: "contains" },
    { name: "startsWith" },
    { name: "endsWith" },
    { name: "matches" },
    { name: "exists" },
    { name: "not" },
    // { name: 'or'},
    // { name: 'and'},
    { name: "inject" },
  ];

  newOperator = [
    { name: "equals" },
    { name: "deepEquals" },
    { name: "contains" },
    { name: "startsWith" },
    { name: "endsWith" },
    { name: "matches" },
    { name: "exists" },
    { name: "inject" },
  ];

  // predicateForm = this.formBuilder.group({
  //   operator: [""],
  //   method: [""],
  //   path: [""],
  //   newPath: [""],
  //   data: [""],
  //   newOperator: [""],
  //   query: [""],
  //   headers: [null],
  //   body: [""]
  // });

  subPredicates: Predicate[] = [];
  showPredicates: boolean = false;
  showSubPredicates: boolean = false;

  private subscription: Subscription;

  constructor(
    private imposterService: ImposterService,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    const filteredGenericPath = this.genericPath.filter((path) => path !== 'other');
    const newPath = filteredGenericPath.includes(this.predicate.path) ? '' : this.predicate.path;
    const headersValue = this.headers.filter(header => JSON.stringify(header.value) === JSON.stringify(this.predicate.headers))[0];

    const predicateObject = {
      operator: this.predicate.operator,
      method: this.predicate.method,
      path: newPath ? 'other' : this.predicate.path,
      newPath: newPath,
      query: this.predicate.query ?? null,
      data: "",
      newOperator: "",
      headers: headersValue?.id ?? null,
      body: this.predicate.body ?? null,
    };
    this.predicateForm.setValue(predicateObject);
    this.subscription = this.predicateForm.valueChanges.subscribe(() => {
      this.updatePredicates();
    });
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  onSubmit() {}

  onDelete() {
    this.deleteUpdate.emit(this.predicateIndex);
  }

  // deleteSubPredicateUpdate(index) {
  //   let tempPredicates: Predicate[] = [];
  //   for (let i = 0; i < this.subPredicates.length; i++) {
  //     if (i !== index) {
  //       tempPredicates.push(this.subPredicates[i]);
  //     }
  //   }
  //   this.subPredicates = tempPredicates;
  //   this.imposterService.onDeleteSubPredicate(index);
  //   this.subPredicates = this.imposterService.onGetPredicates();
  // }

  updatePredicates() {
    const operator = this.predicateForm.get("operator").value;
    const method = this.predicateForm.get("method").value;
    const path = this.predicateForm.get("path").value;
    const newPath = this.predicateForm.get("newPath").value;
    const data = this.predicateForm.get("data").value;
    const newOperator = this.predicateForm.get("newOperator").value;
    const query = this.predicateForm.get("query").value;
    const headersId = this.predicateForm.get("headers").value;
    const body = this.predicateForm.get("body").value;

    this.predicate.operator = operator;
    this.predicate.method = method;
    this.predicate.path = path;
    this.predicate.newPath = newPath;
    this.predicate.data = data;
    this.predicate.newOperator = newOperator;

    switch(method) {
      case('GET'):
      case('DELETE'):
        this.predicate.query = query;
        this.predicate.headers = null;
        this.predicate.body = null;
        break;
      case('POST'):
      case('PUT'):
        this.predicate.query = null;
        this.predicate.headers = JSON.stringify(this.headers.filter(header => header.id === +headersId)[0]?.value ?? '');
        this.predicate.body = body;
        break;
    }
  }

  selectHideData() {
    if (
      this.options.nativeElement.value == "equals" ||
      this.options.nativeElement.value == "deepEquals" ||
      this.options.nativeElement.value == "and" ||
      this.options.nativeElement.value == "equals"
    ) {
      this.predicateForm.controls.data.disable();
    } else {
      this.predicateForm.controls.data.enable();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getFormatedQuery(queryValue) {
    return this.commonService.getFormatedQuery(queryValue);
  }

  onMethodChange(value: string) {
    if (value === 'GET' || value === 'DELETE') {
      this.predicateForm.patchValue({
        headers: null
      });
      this.predicateForm.controls['query'].setValidators([Validators.required, jsonValidator()]);
      this.predicateForm.controls['body'].clearValidators();
      this.predicateForm.controls['query'].updateValueAndValidity();
      this.predicateForm.controls['body'].updateValueAndValidity();
    } else {
      this.predicateForm.controls['body'].setValidators([Validators.required, jsonValidator()]);
      this.predicateForm.controls['query'].clearValidators();
      this.predicateForm.controls['query'].updateValueAndValidity();
      this.predicateForm.controls['body'].updateValueAndValidity();
    }
    this.cdRef.detectChanges();
  }
}
