import { TestBed } from '@angular/core/testing';

import { NgxTokenManager } from './ngx-token.service';

describe('NgxTokenManager', () => {
  let service: NgxTokenManager<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxTokenManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
