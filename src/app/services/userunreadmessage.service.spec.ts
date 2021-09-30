import { TestBed } from '@angular/core/testing';

import { UserUnreadMessageService } from './userunreadmessage.service';

describe('UserUnreadMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserUnreadMessageService = TestBed.get(UserUnreadMessageService);
    expect(service).toBeTruthy();
  });
});
