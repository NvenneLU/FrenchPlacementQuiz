import { TestBed, inject } from '@angular/core/testing';

import { TestconfigService } from './testconfig.service';

describe('TestconfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestconfigService]
    });
  });

  it('should be created', inject([TestconfigService], (service: TestconfigService) => {
    expect(service).toBeTruthy();
  }));
});
