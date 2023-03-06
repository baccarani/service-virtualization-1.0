import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  @Input() index: number = 0;
  @Input() predicate: Predicate = {
    operator: '',
    method: '',
    path: '',
  };
  predicateFormValue: any = [];
  @Input() showEdit: boolean = false;

  @Output() beneficiaryUpdate = new EventEmitter();
  @Output() editUpdate = new EventEmitter();
  @Output() deleteUpdate = new EventEmitter();

  operator = [
    {id: 1, name: 'equals'},
    {id: 2, name: 'deepEquals'},
    {id: 3, name: 'contains'},
    {id: 4, name: 'startsWith'},
    {id: 5, name: 'endsWith'},
    {id: 6, name: 'matches'},
    {id: 7, name: 'exists'},
    {id: 8, name: 'not'},
    {id: 9, name: 'or'},
    {id: 10, name: 'and'},
    {id: 11, name: 'inject'}
  ]

  predicateForm = this.formBuilder.group({
    operator: [''],
    method: [''],
    path: ['']
  });

  predicates: Predicate[] = [{operator: '', method: '', path: ''}]

  
  notPredicateAndOrOperators: boolean = false;
  showPredicatesAndOrOperators: boolean = false;

  constructor(private imposterService: ImposterService, private formBuilder: FormBuilder, private formService: FormService) { }

  ngOnInit(): void {
    this.predicateForm.setValue({ operator: this.predicate.operator, method: this.predicate.method, path: this.predicate.path });
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
    this.predicate.operator = operator;
    this.predicate.method = method;
    this.predicate.path = path;
    const index = this.imposterService.onGetPredicates().findIndex(p => p.method === method && p.path === path);

    if (operator === 'and' || operator === 'or') {
      this.showPredicatesAndOrOperators = true;
      this.notPredicateAndOrOperators = false;
    } else {
      this.notPredicateAndOrOperators = true;
      this.showPredicatesAndOrOperators = false;
    }

    if (index > -1) {
      // Update existing predicate
      this.imposterService.onGetPredicates()[index] = this.predicate;
    } else {
      // Add new predicate
      this.imposterService.onGetPredicates().push(this.predicate);
    }
  }
  
  
}
