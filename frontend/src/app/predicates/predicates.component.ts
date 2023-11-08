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

  @Input() index: number = 0;
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
    { name: 'or'},
    { name: 'and'},
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

  ngOnInit(): void {
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
    this.deleteUpdate.emit(this.index);
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
      console.log(index)
      this.imposterService.onGetPredicates()[index] = this.predicate;
      console.log()
    } else {
      // Add new predicate
      console.log('test')
      this.imposterService.onGetPredicates().push(this.predicate);
    }
  }

  selectHideData(): void {
    if(this.options.nativeElement.value == 'equals' || this.options.nativeElement.value == 'deepEquals' ||
    this.options.nativeElement.value == 'and' || this.options.nativeElement.value == 'equals'
    ){
      this.predicateForm.controls.data.disable();
    }else{
      this.predicateForm.controls.data.enable();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
