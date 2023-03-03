import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Predicate } from '../models/predicate';
import { ImposterService } from '../services/imposter.service';
import { FormBuilder } from '@angular/forms';
import { FormService } from '../services/form.services'; 

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
    data: '',
    newOperator: '',
    query: ''
  };
  predicateFormValue: any = [];
  @Input() showEdit: boolean = false;

  @Output() beneficiaryUpdate = new EventEmitter();
  @Output() editUpdate = new EventEmitter();
  @Output() deleteUpdate = new EventEmitter();

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
    data: [''],
    newOperator: [''],
    query: ['']
  });

  constructor(private imposterService: ImposterService, private formBuilder: FormBuilder, private formService: FormService) { }

  ngOnInit(): void {
    this.predicateForm.setValue({ operator: this.predicate.operator, method: this.predicate.method, path: this.predicate.path, query: this.predicate.query ,data: this.predicate.data, newOperator: this.predicate.newOperator });
    this.predicateForm.valueChanges.subscribe(() => {
      this.updatePredicates();
    });
  }
  

  onSubmit() {
  }

  onDelete() {
    this.deleteUpdate.emit(this.index);
  }

  updatePredicates() {
    const operator = this.predicateForm.get('operator').value;
    const method = this.predicateForm.get('method').value;
    const path = this.predicateForm.get('path').value;
    const data = this.predicateForm.get('data').value
    const newOperator = this.predicateForm.get('newOperator').value;
    const query = this.predicateForm.get('query').value;

    this.predicate.operator = operator;
    this.predicate.method = method;
    this.predicate.path = path;
    this.predicate.data = data;
    this.predicate.newOperator = newOperator;
    this.predicate.query = query;

    const index = this.imposterService.onGetPredicates().findIndex(p => p.method === method && p.query=== query && p.path === path && p.data === data && p.newOperator === newOperator);
    if (index > -1) {
      // Update existing predicate
      this.imposterService.onGetPredicates()[index] = this.predicate;
    } else {
      // Add new predicate
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
}
