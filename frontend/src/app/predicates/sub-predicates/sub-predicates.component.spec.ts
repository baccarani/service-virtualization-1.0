import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SubPredicatesComponent } from "./predicates-and-or-operators.component";

describe("SubPredicatesComponent", () => {
  let component: SubPredicatesComponent;
  let fixture: ComponentFixture<SubPredicatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubPredicatesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubPredicatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
