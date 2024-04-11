import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, forkJoin } from "rxjs";
import { mergeMap } from "rxjs/operators";
// import { Predicate } from '../models/predicate';
// import { Stubs } from '../models/stubs';

@Injectable({
  providedIn: 'root'
})
export class ImposterService {
  private imposterArray: unknown[] = [];
  private stubs = [];
  private predicates = [];
  private responses = [];
  // private subPredicates = [];
  updateImposterArray = new Subject();

  constructor(private http: HttpClient) {}

  setDefaultStubs() {
    if (this.stubs.length === 0) {
      const defaultStubs = {
        stubID: Date.now(),
        predicates: [
          {
            predicateID: Date.now(),
            operator: "",
            method: "",
            path: "",
            newPath: "",
            data: "",
            newOperator: "",
            query: "",
            headers: null,
            body: ""
          },
        ],
        responses: [
          { responseID: Date.now(), statusCode: "", headers: null, body: "", proxy: false, proxyTo: [""] },
        ],
      };
      this.stubs.push(defaultStubs);
    }
  }

  // setOperator(operator) {
  //     this.subPredicates.push(operator);
  // }

  onGetPredicates() {
    return this.predicates.slice();
  }

  onGetResponses() {
    return this.responses.slice();
  }

  onGetStubs() {
    return this.stubs;
  }

  onAddStub() {
    const newStub = {
      stubID: Date.now(),
      predicates: [
        {
          predicateID: Date.now(),
          operator: "",
          method: "",
          path: "",
          newPath: "",
          data: "",
          newOperator: "",
          query: "",
          headers: null,
          body: ""
        },
      ],
      responses: [
        { responseID: Date.now(), statusCode: "", headers: null, body: "", proxy: false, proxyTo: [""] },
      ],
    };
    this.stubs.push(newStub);
  }

  onAddPredicate(stubID: number) {
    const index = this.stubs.findIndex((stub) => stub.stubID === stubID);
    this.stubs[index].predicates.push({
      predicateID: Date.now(),
      operator: "",
      method: "",
      path: "",
      newPath: "",
      data: "",
      newOperator: "",
      query: "",
      headers: null,
      body: ""
    });
  }

  onAddResponse(stubID: number) {
    const index = this.stubs.findIndex((stub) => stub.stubID === stubID);
    this.stubs[index].responses.push({
      responseID: Date.now(),
      statusCode: "",
      headers: null,
      body: "",
      proxy: false,
      proxyTo: ""
    });
  }

  onResetPredicates() {
    this.predicates = [];
  }

  onResetResponses() {
    this.responses = [];
  }

  onResetStubs() {
    this.stubs = [];
  }

  onDeleteStub(stubID) {
    const index = this.stubs.findIndex((stub) => stub.stubID === stubID);
    this.stubs.splice(index, 1);
  }

  onDeletePredicate(predicateIndex, stubIndex) {
    this.stubs[stubIndex].predicates.splice(predicateIndex, 1);
  }

  onDeleteResponse(responseIndex, stubIndex) {
    this.stubs[stubIndex].responses.splice(responseIndex, 1);
  }

  // onDeleteSubPredicate(index) {
  //     this.subPredicates.splice(index, 1);
  // }

  onGetImposter() {
    return this.http.get(`http://localhost:5000/imposters`).pipe(
      mergeMap((responseData: any) => {
        const imposterArray = responseData.imposters;
        return forkJoin(
          imposterArray.map((imposter: any) => {
            return this.http.get(
              `http://localhost:5000/imposters/${imposter.port}`,
            );
          }),
        );
      }),
    );
  }

  onViewImposter(port) {
    return this.http.get(`http://localhost:5000/imposters/${port}`);
  }

  onDeleteImposter(port, index) {
    this.http
      .delete(`http://localhost:5000/imposters/${port}`)
      .subscribe(() => {
        this.imposterArray.splice(index, 1);
        this.updateImposterArray.next();
      });
  }

  onEditImposter(formValues: any) {
    const formattedImposterData = this.formatImposterData(formValues);
    return this.http
      .put(
        `http://localhost:5000/imposters/${formValues.port}/stubs`,
        formattedImposterData,
      )
      .subscribe(
        () => {
          this.updateImposterArray.next();
        },
        (error) => {
          console.error(error);
        },
      );
  }

  formatImposterData(formValues: any) {
    const stubs = this.stubs.map((stub) => {
      const predicates = stub.predicates.map((predicate) => {
        const operator = predicate.operator;
        let query;
        try {
          query = JSON.parse(predicate.query);
        } catch(error) {
          query = {};
        }
        let updatePath;
        if (predicate.path == "other") {
          updatePath = predicate.newPath;
        } else {
          updatePath = predicate.path;
        }
        if (operator === "or" || operator === "and") {
          return {
            [operator]: [
              {
                [predicate.newOperator]: {
                  method: predicate.method,
                  path: updatePath,
                  data: predicate.data,
                },
              },
            ],
          };
        } else if (operator === "not") {
          const predicateObj = {
            [operator]: {
              equals: {
                method: predicate.method,
                path: updatePath,
              },
            },
          };
          switch(predicate.method) {
            case('GET'):
            case('DELETE'):
              predicateObj[operator].equals['query'] = query;
              break;
            case('POST'):
            case('PUT'):
              predicateObj[operator].equals['headers'] = JSON.parse(predicate.headers) || {};
              predicateObj[operator].equals['body'] =  JSON.parse(predicate.body) || {};
              break;
          }
          return predicateObj;
        } else {
          const predicateObj = {
            [operator]: {
              method: predicate.method,
              path: updatePath,
            },
          };
          switch(predicate.method) {
            case('GET'):
            case('DELETE'):
              predicateObj[operator]['query'] = query;
              break;
            case('POST'):
            case('PUT'):
              predicateObj[operator]['headers'] = JSON.parse(predicate.headers) || {};
              predicateObj[operator]['body'] =  JSON.parse(predicate.body) || {};
              break;
          }
          return predicateObj;
        }
      });
      const responses = stub.responses.map((response) => {
        const statusCode = response.statusCode;
        const headers = JSON.parse(response.headers) || {};
        const body = JSON.parse(response.body) || {};
        const proxy = response.proxy;
        const proxyTo = response.proxyTo;

        return proxy 
          ? { proxy: { to: proxyTo } }
          : { is: { statusCode: statusCode, headers: headers, body: body } };
      });

      return {
        predicates: predicates,
        responses: responses,
      };
    });
    return {
      port: formValues.port,
      protocol: formValues.protocol,
      name: formValues.name,
      stubs: stubs,
    };
  }

  onCreateImposter(formValues) {
    const data = this.formatImposterData(formValues);
    this.http.post(`http://localhost:5000/imposters`, data).subscribe(
      () => {
        this.updateImposterArray.next();
      },
      (error) => {
        console.error(error);
      },
    );
  }

  onExportImposter(data) {
    const url = `http://localhost:5000/imposters/${data}/_postman`;
    this.http.get(url, { responseType: "text" }).subscribe((res) => {
      const blob = new Blob([res], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `imposter-${data}.json`;
      window.URL.revokeObjectURL(url);
    });
  }
}
