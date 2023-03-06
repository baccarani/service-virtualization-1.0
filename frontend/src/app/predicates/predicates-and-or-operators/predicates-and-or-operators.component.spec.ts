import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredicatesAndOrOperatorsComponent } from './predicates-and-or-operators.component';

describe('PredicatesAndOrOperatorsComponent', () => {
  let component: PredicatesAndOrOperatorsComponent;
  let fixture: ComponentFixture<PredicatesAndOrOperatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredicatesAndOrOperatorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PredicatesAndOrOperatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
