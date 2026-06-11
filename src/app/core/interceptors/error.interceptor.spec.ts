import { TestBed } from '@angular/core/testing';

import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be defined', () => {
    expect(errorInterceptor).toBeDefined();
  });
});
