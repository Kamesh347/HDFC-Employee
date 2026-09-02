import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionModel } from './transaction-model';

describe('TransactionModel', () => {
  let component: TransactionModel;
  let fixture: ComponentFixture<TransactionModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionModel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionModel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
