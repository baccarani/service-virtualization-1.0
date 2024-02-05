import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PredicatesComponent } from "./predicates.component";

describe("PredicatesComponent", () => {
  let component: PredicatesComponent;
  let fixture: ComponentFixture<PredicatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PredicatesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PredicatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
