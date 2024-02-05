import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Predicate } from '../models/predicate';
import { ImposterService } from '../services/imposter.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-predicates',
  templateUrl: './predicates.component.html',
  styleUrls: ['./predicates.component.css']
})
export class PredicatesComponent implements OnInit {
  @ViewChild('options') options: ElementRef;
  @Input() predicateIndex: number = 0;
  @Input() predicate: Predicate = {
    operator: '',
    method: '',
    path: '',
    newpath: '',
    data: '',
    newOperator: '',
    query: ''
  };
  @Input() showEdit: boolean = false;
  @Input() protocol: string;
  @Input() port: number;
  @Output() beneficiaryUpdate = new EventEmitter();
  @Output() editUpdate = new EventEmitter();
  @Output() deleteUpdate = new EventEmitter();

  genericPath = [
    '/customer',
    '/user',
    'other'
  ];

  operator = [
    { name: 'equals'},
    { name: 'deepEquals'},
    { name: 'contains'},
    { name: 'startsWith'},
    { name: 'endsWith'},
    { name: 'matches'},
    { name: 'exists'},
    { name: 'not'},
    // { name: 'or'},
    // { name: 'and'},
    { name: 'inject'}
  ];

  newOperator = [
    { name: 'equals'},
    { name: 'deepEquals'},
    { name: 'contains'},
    { name: 'startsWith'},
    { name: 'endsWith'},
    { name: 'matches'},
    { name: 'exists'},
    { name: 'inject'}
  ];
  
  predicateForm = this.formBuilder.group({
    operator: [''],
    method: [''],
    path: [''],
    newpath: [''],
    data: [''],
    newOperator: [''],
    query: ['']
  });

  subPredicates: Predicate[] = [];
  showPredicates: boolean = false;
  showSubPredicates: boolean = false;

  private subscription: Subscription;

  constructor(private imposterService: ImposterService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.predicateForm.setValue({
      operator: this.predicate.operator,
      method: this.predicate.method,
      path: this.predicate.path,
      newpath: this.predicate.newpath,
      query: this.predicate.query,
      data: this.predicate.data,
      newOperator: this.predicate.newOperator
    });
    this.subscription = this.predicateForm.valueChanges.subscribe(() => {
      this.updatePredicates();
    });
  }

  onSubmit() {
  }

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
    const operator = this.predicateForm.get('operator').value;
    const method = this.predicateForm.get('method').value;
    const path = this.predicateForm.get('path').value;
    const newpath = this.predicateForm.get('newpath').value;
    const data = this.predicateForm.get('data').value
    const newOperator = this.predicateForm.get('newOperator').value;
    const query = this.predicateForm.get('query').value;

    this.predicate.operator = operator;
    this.predicate.method = method;
    this.predicate.path = path;
    this.predicate.newpath = newpath;
    this.predicate.data = data;
    this.predicate.newOperator = newOperator;
    this.predicate.query = query;    

    const index = this.imposterService.onGetPredicates().findIndex(p => p.method === method && p.query=== query && p.path === path && p.newpath === newpath && p.data === data && p.newOperator === newOperator);
    if (index > -1) {
      // Update existing predicate
      this.imposterService.onGetPredicates()[index] = this.predicate;
    } else {
      // Add new predicate
      this.imposterService.onGetPredicates().push(this.predicate);
    }
  }

  selectHideData() {
    if (this.options.nativeElement.value == 'equals' || this.options.nativeElement.value == 'deepEquals' ||
      this.options.nativeElement.value == 'and' || this.options.nativeElement.value == 'equals'
    ) {
      this.predicateForm.controls.data.disable();
    } else {
      this.predicateForm.controls.data.enable();
    }
  }

  parseJson(value: string) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return {};
    }
  }

  getFormatedQuery(queryVal: string) {
    let queryObj = this.parseJson(queryVal);
    let keys = Object.keys(queryObj) || null;
    let queryString = '';
    if (keys && keys.length > 0) {
      queryString = '?';
      keys.forEach((key, index) => {
        queryString += `${key}=${queryObj[key]}`; 
        if ((keys.length === 2 && index === 0) || (keys.length > 2 && index !== keys.length-1)) {
          queryString += '&';
        }
      });
    }
    return queryString;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
