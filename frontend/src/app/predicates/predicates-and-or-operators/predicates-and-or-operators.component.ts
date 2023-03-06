import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Predicate } from 'src/app/models/predicate';
import { ImposterService } from 'src/app/services/imposter.service';

@Component({
  selector: 'app-predicates-and-or-operators',
  templateUrl: './predicates-and-or-operators.component.html',
  styleUrls: ['./predicates-and-or-operators.component.css']
})
export class PredicatesAndOrOperatorsComponent implements OnInit {

  @Input() index: number = 0;
  @Input() predicate: Predicate = {
    operator: '',
    method: '',
    path: '',
    query: '',
  };
  predicateFormValue: any = [];
  @Input() showEdit: boolean = false;

  @Output() beneficiaryUpdate = new EventEmitter();
  @Output() editUpdate = new EventEmitter();
  @Output() deleteUpdate = new EventEmitter();

  predicateForm = this.formBuilder.group({
    operator: [''],
    method: [''],
    path: ['']
  });

  showAndOrOperators: boolean = false;
  showAddPredicateLink: boolean = false;
  showMethodAndPathFields: boolean = false;

  predicates: Predicate[] = []

  constructor(private formBuilder: FormBuilder, private imposterService: ImposterService,) { }

  ngOnInit(): void {
    console.log(this.index)
    console.log('prediates-and-or-operators');
    if (this.imposterService.onGetPredicates().length === 0) {
      this.imposterService.onAddPredicate({operator: '', method: '', path: '', query: ''})
    }
    this.predicates = this.imposterService.onGetPredicates();
  }

  onSubmit() {

  }

  onDelete() {

  }

}
