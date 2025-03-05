import { TestBed } from '@angular/core/testing';

import { Board } from './board';

describe('BoardService', () => {
  let service: Board;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Board);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
