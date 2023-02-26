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
    method: '',
    path: '',
  };
  predicateFormValue: any = [];
  @Input() showEdit: boolean = false;

  @Output() beneficiaryUpdate = new EventEmitter();
  @Output() editUpdate = new EventEmitter();
  @Output() deleteUpdate = new EventEmitter();

  predicateForm = this.formBuilder.group({
    method: [''],
    path: ['']
  });

  constructor(private imposterService: ImposterService, private formBuilder: FormBuilder, private formService: FormService) { }

  ngOnInit(): void {
    this.predicateForm.setValue({ method: this.predicate.method, path: this.predicate.path });
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
    const method = this.predicateForm.get('method').value;
    const path = this.predicateForm.get('path').value;
    this.predicate.method = method;
    this.predicate.path = path;
    const index = this.imposterService.onGetPredicates().findIndex(p => p.method === method && p.path === path);
    if (index > -1) {
      // Update existing predicate
      this.imposterService.onGetPredicates()[index] = this.predicate;
    } else {
      // Add new predicate
      this.imposterService.onGetPredicates().push(this.predicate);
    }
  }
  
  
}
