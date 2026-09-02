import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionService } from './transaction-service';

describe('TransactionService', () => {
  let component: TransactionService;
  let fixture: ComponentFixture<TransactionService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
