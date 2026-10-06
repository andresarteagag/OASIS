import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEscenariosComponent } from './admin-escenarios.component';

describe('AdminEscenariosComponent', () => {
  let component: AdminEscenariosComponent;
  let fixture: ComponentFixture<AdminEscenariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminEscenariosComponent]
    });
    fixture = TestBed.createComponent(AdminEscenariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
