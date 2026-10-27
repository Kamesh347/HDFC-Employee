import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AllTransactions } from './all-transactions';

describe('AllTransactions', () => {
  let component: AllTransactions;
  let fixture: ComponentFixture<AllTransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllTransactions],
      providers: [{ provide: Router, useValue: { navigate: vi.fn() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(AllTransactions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('parses credit and debit statement rows', () => {
    const rows = component.parseStatementCsv(
      'Date,Description,Debit,Credit\n2026-10-01,Coffee shop,250.00,\n2026-10-02,Salary,,45000.00',
    );

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ type: 'Expense', amount: 250, category: 'Food & Dining' });
    expect(rows[1]).toMatchObject({ type: 'Income', amount: 45000, category: 'Income' });
  });

  it('parses quoted descriptions and signed amount exports', () => {
    const rows = component.parseStatementCsv(
      'Tran Date,Particulars,Amount,Dr/Cr\n01/10/2026,"Cafe, Main Street",(125.50),DR\n02/10/2026,Refund,25.00,CR',
    );

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      description: 'Cafe, Main Street',
      type: 'Expense',
      amount: 125.5,
    });
    expect(rows[1]).toMatchObject({ description: 'Refund', type: 'Income', amount: 25 });
  });

  it('finds headers after metadata and follows an explicit debit marker', () => {
    const rows = component.parseStatementCsv(
      'Account,XX1234\nGenerated,2026-10-26\nDate,Description,Amount,Dr/Cr\n2026-10-01,Card purchase,875.00,DR',
    );

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ sourceRow: 4, type: 'Expense', amount: 875 });
  });

  it('adds reviewed rows and updates transaction totals', () => {
    component.statementRows.set([
      {
        id: 'import-1',
        sourceRow: 2,
        date: '1/10/2026',
        type: 'Income',
        employee: 'Statement import',
        description: 'Payroll',
        category: 'Income',
        amount: 1000,
        paymentMethod: 'Bank statement',
      },
    ]);

    component.importStatementRows();

    expect(component.transactions()[0].description).toBe('Payroll');
    expect(component.totalTransactionsCount()).toBe(1246);
    expect(component.totalIncomeAmount()).toBe(1141000);
    expect(component.statementImported()).toBe(true);
  });
});
