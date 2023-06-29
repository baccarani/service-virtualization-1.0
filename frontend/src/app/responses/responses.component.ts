import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ImposterService } from '../services/imposter.service';
import { Response } from '../models/response';

@Component({
  selector: 'app-responses',
  templateUrl: './responses.component.html',
  styleUrls: ['./responses.component.css']
})
export class ResponsesComponent implements OnInit {

  @Input() index: number = 0;
  @Input() responseIndex: number = 0;
  @Input() response: Response = {
    statusCode: '',
    headers: '',
    body: '',
  };

  @Output() deleteUpdate = new EventEmitter();
  @Output() deleteResponseUpdate = new EventEmitter();

  statusCode = [
    'Informational responses (100 to 199)',
    'Successful responses (200 to 299)',
    'Redirection messages (300 to 399)',
    'Client error responses (400 to 499)',
    'Server error responses (500 to 599)',
  ];

  informationRes = [
    '100',
    '101',
    '102',
    '103',
  ];

  successRes = [
    '200',
    '201',
    '202',
    '203',
    '204',
    '205',
    '206',
    '207',
    '208',
    '226',
  ];

  redirectionRes = [
    '300',
    '301',
    '302',
    '303',
    '304',
    '305',
    '306',
    '307',
    '308',
  ];

  clientErrRes = [
    '400',
    '401',
    '402',
    '403',
    '404',
    '405',
    '406',
    '407',
    '408',
    '409',
    '410',
    '411',
    '412',
    '413',
    '414',
    '415',
    '416',
    '417',
    '418',
    '421',
    '422',
    '423',
    '424',
    '425',
    '426',
    '428',
    '429',
    '431',
    '451',
  ];

  serverErrRes = [
    '500',
    '501',
    '502',
    '503',
    '504',
    '505',
    '506',
    '507',
    '508',
    '510',
    '511',
  ];

  headers = [
    { 'Content-Type': 'application/json' },
  ]

  responseForm = this.formBuilder.group({
    statusCode: 0,
    infoCode: [''],
    successCode: [''],
    redirectCode: [''],
    clientCode: [''],
    serverCode: [''],
    headers: [''],
    body: [''],
  });

  constructor(private formBuilder: FormBuilder, private imposterService: ImposterService) { }

  ngOnInit(): void {
    this.responseForm.setValue({
      statusCode: this.response.statusCode,
      infoCode: '',
      successCode: '',
      redirectCode: '',
      clientCode: '',
      serverCode: '',
      headers: this.response.headers,
      body: this.response.body,
    });
    this.responseForm.valueChanges.subscribe(() => {
      this.updateResponses();
    });
  }

  onSubmit(): void {

  }

  onDelete() {
    this.deleteResponseUpdate.emit(this.responseIndex);
  }

  updateResponses() {

    const statusCode = this.responseForm.get('statusCode').value;
    const infoCode = Number(this.responseForm.get('infoCode').value);
    const successCode = Number(this.responseForm.get('successCode').value);
    const redirectCode = Number(this.responseForm.get('redirectCode').value);
    const clientCode = Number(this.responseForm.get('clientCode').value);
    const serverCode = Number(this.responseForm.get('serverCode').value);
    const headers = this.responseForm.get('headers').value;
    const body = this.responseForm.get('body').value;

    if (infoCode) {
      this.response.statusCode = infoCode;
    }
    if (successCode) {
      this.response.statusCode = successCode;
    }
    if (redirectCode) {
      this.response.statusCode = redirectCode;
    }
    if (clientCode) {
      this.response.statusCode = clientCode;
    }
    if (serverCode) {
      this.response.statusCode = serverCode;
    }
    this.response.headers = headers;
    this.response.body = body;

    const index = this.imposterService.onGetResponses().findIndex(p => p.statusCode === statusCode && p.headers === headers && p.body === body);
    if (index > -1) {
      // Update existing predicate
      this.imposterService.onGetResponses()[index] = this.response;
    } else {
      // Add new predicate
      this.imposterService.onGetResponses().push(this.response);
    }
  }

}
