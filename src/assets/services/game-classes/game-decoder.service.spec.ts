import { TestBed } from '@angular/core/testing';

import { GameDecoderService } from '../../../assets/services/game-classes/game-decoder.service';

describe('GameDecoderService', () => {
  let service: GameDecoderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameDecoderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
