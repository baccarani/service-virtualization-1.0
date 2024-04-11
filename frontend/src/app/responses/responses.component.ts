import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ImposterService } from "../services/imposter.service";
import { Response } from "../models/response";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import Papa from "papaparse";
import { HEADERS } from "../models/constants";
import { Subscription } from "rxjs";
import { jsonValidator } from "../shared/json-validator";

@Component({
  selector: "app-responses",
  templateUrl: "./responses.component.html",
  styleUrls: ["./responses.component.css"],
})
export class ResponsesComponent implements OnInit, AfterViewInit {
  @ViewChild("file") fileInput: ElementRef;
  @Input() index: number = 0;
  @Input() responseIndex: number = 0;
  @Input() response: Response = {
    statusCode: "",
    headers: null,
    body: "",
    proxy: false,
    proxyTo: ""
  };
  @Input() responseForm: FormGroup;
  @Output() deleteUpdate = new EventEmitter();
  @Output() deleteResponseUpdate = new EventEmitter();

  statusCode = [
    "Informational responses (100 to 199)",
    "Successful responses (200 to 299)",
    "Redirection messages (300 to 399)",
    "Client error responses (400 to 499)",
    "Server error responses (500 to 599)",
  ];

  informationRes = ["100", "101", "102", "103"];

  successRes = [
    "200",
    "201",
    "202",
    "203",
    "204",
    "205",
    "206",
    "207",
    "208",
    "226",
  ];

  redirectionRes = [
    "300",
    "301",
    "302",
    "303",
    "304",
    "305",
    "306",
    "307",
    "308",
  ];

  clientErrRes = [
    "400",
    "401",
    "402",
    "403",
    "404",
    "405",
    "406",
    "407",
    "408",
    "409",
    "410",
    "411",
    "412",
    "413",
    "414",
    "415",
    "416",
    "417",
    "418",
    "421",
    "422",
    "423",
    "424",
    "425",
    "426",
    "428",
    "429",
    "431",
    "451",
  ];

  serverErrRes = [
    "500",
    "501",
    "502",
    "503",
    "504",
    "505",
    "506",
    "507",
    "508",
    "510",
    "511",
  ];

  headers = HEADERS;
  // responseForm = this.formBuilder.group({
  //   statusCode: [""],
  //   infoCode: [""],
  //   successCode: [""],
  //   redirectCode: [""],
  //   clientCode: [""],
  //   serverCode: [""],
  //   headers: [null],
  //   body: ["", [jsonValidator()]],
  // });
  @Input() hideCloseButton: boolean;
  @Input() isEditImposter: boolean = false;

  private subscription: Subscription;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: unknown,
    private formBuilder: FormBuilder,
    private imposterService: ImposterService,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const headersValue = this.headers.filter(header => JSON.stringify(header.value) === JSON.stringify(this.response.headers))[0];

    const responseObject = {
      statusCode: "",
      infoCode: "",
      successCode: "",
      redirectCode: "",
      clientCode: "",
      serverCode: "",
      headers: headersValue?.id ?? null,
      body: this.response.body ?? null,
      proxy: false,
      proxyTo: ""
    };

    const statusCode = this.response.statusCode;
    const caseNumber = Math.floor(statusCode / 100);

    switch (caseNumber) {
      case 1:
        responseObject.statusCode = this.statusCode[0];
        responseObject.infoCode = this.response.statusCode;
        break;
      case 2:
        responseObject.statusCode = this.statusCode[1];
        responseObject.successCode = this.response.statusCode;
        break;
      case 3:
        responseObject.statusCode = this.statusCode[2];
        responseObject.redirectCode = this.response.statusCode;
        break;
      case 4:
        responseObject.statusCode = this.statusCode[3];
        responseObject.clientCode = this.response.statusCode;
        break;
      case 5:
        responseObject.statusCode = this.statusCode[4];
        responseObject.serverCode = this.response.statusCode;
        break;
    }

    responseObject.proxy = this.response.proxy;
    responseObject.proxyTo = this.response.proxyTo;

    this.responseForm.setValue(responseObject);
    this.subscription = this.responseForm.valueChanges.subscribe(() => {
      this.updateResponses();
    });
  }

  ngAfterViewInit() {
    this.updateResponses();
    this.cdRef.detectChanges();
  }

  onSubmit() {}

  onDelete() {
    this.deleteResponseUpdate.emit(this.responseIndex);
  }

  updateResponses() {
    //const statusCode = this.responseForm.get("statusCode").value;
    const infoCode = Number(this.responseForm.get("infoCode").value);
    const successCode = Number(this.responseForm.get("successCode").value);
    const redirectCode = Number(this.responseForm.get("redirectCode").value);
    const clientCode = Number(this.responseForm.get("clientCode").value);
    const serverCode = Number(this.responseForm.get("serverCode").value);
    const headersId = this.responseForm.get("headers").value;
    const body = this.responseForm.get("body").value;
    const proxy = this.responseForm.get("proxy").value;
    const proxyTo = this.responseForm.get("proxyTo").value;

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
    this.response.headers = JSON.stringify(this.headers.filter(header => header.id === +headersId)[0]?.value ?? '');
    this.response.body = body;
    this.response.proxy = proxy;
    this.response.proxyTo = proxyTo;

    // const index = this.imposterService
    //   .onGetResponses()
    //   .findIndex(
    //     (p) =>
    //       p.statusCode === statusCode &&
    //       p.headers === headers &&
    //       p.body === body,
    //   );
    // if (index > -1) {
    //   // Update existing predicate
    //   //this.imposterService.onGetResponses()[index] = this.response;
    // } else {
    //   // Add new predicate
    //   this.imposterService.onGetResponses().push(this.response);
    // }
  }

  uploadFile(files: File[]) {
    const file = files[0] || null;
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          this.responseForm.patchValue({
            body: JSON.stringify(results.data),
          });
        },
      });
    }
  }

  clearTextarea() {
    this.fileInput.nativeElement.value = null;
    this.responseForm.patchValue({
      body: null,
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onStatusCodeChange(statusCode) {
    //add status code validation

    switch (statusCode) {
      case this.statusCode[0]:
        this.responseForm.patchValue({
          successCode: null,
          redirectCode: null,
          clientCode: null,
          serverCode: null
        });
        break;
      case this.statusCode[1]:
        this.responseForm.patchValue({
          infoCode: null,
          redirectCode: null,
          clientCode: null,
          serverCode: null
        });
        break;
      case this.statusCode[2]:
        this.responseForm.patchValue({
          infoCode: null,
          successCode: null,
          clientCode: null,
          serverCode: null,
        });
        break;
      case this.statusCode[3]:
        this.responseForm.patchValue({
          infoCode: null,
          successCode: null,
          redirectCode: null,
          serverCode: null
        });
        break;
      case this.statusCode[4]:
        this.responseForm.patchValue({
          infoCode: null,
          successCode: null,
          redirectCode: null,
          clientCode: null
        });
        break;
    }
  }

  onProxyChange(checked) {
    if (checked) {
      this.responseForm.controls['proxyTo'].setValidators([Validators.required]);
      this.responseForm.controls['proxyTo'].updateValueAndValidity();

      this.responseForm.controls['headers'].clearValidators();
      this.responseForm.controls['body'].clearValidators();
      this.responseForm.controls['statusCode'].clearValidators();
      this.responseForm.controls['headers'].updateValueAndValidity();
      this.responseForm.controls['body'].updateValueAndValidity();
      this.responseForm.controls['statusCode'].updateValueAndValidity();
    } else {
      this.responseForm.controls['proxyTo'].clearValidators();
      this.responseForm.controls['proxyTo'].updateValueAndValidity();

      this.responseForm.controls['headers'].setValidators([Validators.required, jsonValidator()]);
      this.responseForm.controls['body'].setValidators([Validators.required, jsonValidator()]);
      this.responseForm.controls['statusCode'].setValidators([Validators.required]);
      this.responseForm.controls['headers'].updateValueAndValidity();
      this.responseForm.controls['body'].updateValueAndValidity();
      this.responseForm.controls['statusCode'].updateValueAndValidity();
    }
    this.cdRef.detectChanges();
  }
}
