import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CifradoPage } from './cifrado.page';

describe('CifradoPage', () => {
  let component: CifradoPage;
  let fixture: ComponentFixture<CifradoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CifradoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
