import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-predicates',
  templateUrl: './predicates.component.html',
  styleUrls: ['./predicates.component.css']
})
export class PredicatesComponent implements OnInit {
  showLineBreak: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
