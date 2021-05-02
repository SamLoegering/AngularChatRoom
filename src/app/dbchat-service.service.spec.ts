import { TestBed } from '@angular/core/testing';

import { DBChatServiceService } from './dbchat-service.service';

describe('DBChatServiceService', () => {
  let service: DBChatServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DBChatServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
