import { TestBed } from '@angular/core/testing';

import { Field } from './field';

describe('FieldService', () => {
  let service: Field;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Field);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
