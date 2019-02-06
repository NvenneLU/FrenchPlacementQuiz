import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TestConfig } from './TestConfig';

declare var M: any;

@Injectable()
export class TestconfigService {

  configUrl: string = '/frenchFSL/requestConfig.php/';
  // configUrl: string = 'https://www3.laurentian.ca/angular/french-test/src/requestConfig.php/';

  testConfig: TestConfig;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8',
    })
  };


  constructor(private http: HttpClient) { }




  getConfig() {
    return this.testConfig;
  }

  saveNewConfig(config: TestConfig) {
    this.testConfig = config;
    this.http.post(this.configUrl, this.testConfig, this.httpOptions).subscribe(success => {if(success) M.toast({html: 'Configuration Saved'}); else {M.toast({html: 'Saved failed'});}});
  }

}
