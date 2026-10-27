import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent } from './select-component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters options by the search text', () => {
    component.options = [
      { value: 'it', label: 'Information Technology' },
      { value: 'hr', label: 'Human Resources' },
    ];
    component.searchText = 'human';

    expect(component.filteredOptions).toEqual([{ value: 'hr', label: 'Human Resources' }]);
  });

  it('writes the selected option through the forms value accessor', () => {
    const onChange = vi.fn();
    component.registerOnChange(onChange);
    const option = { value: 'it', label: 'Information Technology' };

    component.selectOption(option);

    expect(component.selectedValue).toBe('it');
    expect(component.searchText).toBe('Information Technology');
    expect(onChange).toHaveBeenCalledWith('it');
  });

  it('keeps the selected value while filtering options', () => {
    component.writeValue('it');

    component.onSearch({ target: { value: 'human' } } as unknown as Event);

    expect(component.selectedValue).toBe('it');
    expect(component.filteredOptions).toEqual([]);
  });
});
