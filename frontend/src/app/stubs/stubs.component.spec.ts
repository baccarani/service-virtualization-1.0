import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StubsComponent } from './stubs.component';

describe('StubsComponent', () => {
  let component: StubsComponent;
  let fixture: ComponentFixture<StubsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StubsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
