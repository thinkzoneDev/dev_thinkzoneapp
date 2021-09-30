import { TestBed } from '@angular/core/testing';

import { ServerDownService } from './server-down.service';

describe('ServerDownService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerDownService = TestBed.get(ServerDownService);
    expect(service).toBeTruthy();
  });
});
