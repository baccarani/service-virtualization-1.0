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
import { FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs";
import { CommonService } from "../services/common.service";

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
  };
  @Input() showEdit: boolean = false;
  @Input() protocol: string;
  @Input() port: number;
  @Output() beneficiaryUpdate = new EventEmitter();
  @Output() editUpdate = new EventEmitter();
  @Output() deleteUpdate = new EventEmitter();

  genericPath = ["/customer", "/user", "other"];

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

  predicateForm = this.formBuilder.group({
    operator: [""],
    method: [""],
    path: [""],
    newPath: [""],
    data: [""],
    newOperator: [""],
    query: [""],
  });

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
    let filteredGenericPath = this.genericPath.filter((path) => path !== 'other');
    let newPath = filteredGenericPath.includes(this.predicate.path) ? '' : this.predicate.path;
    let predicateObject = {
      operator: this.predicate.operator,
      method: this.predicate.method,
      path: newPath ? 'other' : this.predicate.path,
      newPath: newPath,
      query: this.predicate.query,
      data: "",
      newOperator: "",
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

    this.predicate.operator = operator;
    this.predicate.method = method;
    this.predicate.path = path;
    this.predicate.newPath = newPath;
    this.predicate.data = data;
    this.predicate.newOperator = newOperator;
    this.predicate.query = query;
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
}
