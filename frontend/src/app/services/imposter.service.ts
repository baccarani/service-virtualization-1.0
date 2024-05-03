import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, forkJoin, of, throwError } from "rxjs";
import { mergeMap, switchMap } from "rxjs/operators";
// import { Predicate } from '../models/predicate';
// import { Stubs } from '../models/stubs';

@Injectable({
  providedIn: "root",
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
        proxy: false,
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
            body: "",
          },
        ],
        responses: [
          { responseID: Date.now(), statusCode: "", headers: null, body: "", proxyTo: [""] },
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
      proxy: false,
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
          body: "",
        },
      ],
      responses: [
        { responseID: Date.now(), statusCode: "", headers: null, body: "", proxyTo: [""] },
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
      body: "",
    });
  }

  onAddResponse(stubID: number) {
    const index = this.stubs.findIndex((stub) => stub.stubID === stubID);
    this.stubs[index].responses.push({
      responseID: Date.now(),
      statusCode: "",
      headers: null,
      body: "",
      proxyTo: ""
    });
  }

  onProxyChange(stubID: number, isProxy: boolean) {
    const index = this.stubs.findIndex((stub) => stub.stubID === stubID);
    this.stubs[index].proxy = isProxy;
    //clear all predicates and responses
    this.stubs[index].predicates = [];
    this.stubs[index].responses = [];
    //add one predicate and response
    this.onAddPredicate(stubID);
    this.onAddResponse(stubID);
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
        if (imposterArray.length > 0) {
          return forkJoin(
            imposterArray.map((imposter: any) => {
              return this.http.get(
                `http://localhost:5000/imposters/${imposter.port}`
              );
            })
          );
        } else {
          return of([]);
        }
      })
    );
  }

  onViewImposter(port) {
    return this.http.get(`http://localhost:5000/imposters/${port}`);
  }

  onDeleteImposter(port, index) {
    return this.http.post("http://localhost:3000/deletedImposter", { port: port }).pipe(
      switchMap((mongoResult) => {
        if (mongoResult && Object.keys(mongoResult).length > 0) {
          return this.http.delete(`http://localhost:5000/imposters/${port}`).pipe(
            switchMap((mbResult) => {
              if (Object.keys(mbResult).length > 0) {
                this.imposterArray.splice(index, 1);
                return of(mbResult);
              } else {
                return of({});
              }
            })
          )
        } else {
          return of({});
        }
      })
    );
  }

  onEditImposter(formValues: any) {
    //NOTE: adding two predicates doesnt work when matching
    const formattedImposterData = this.formatImposterData(formValues);
    return this.http
      .put(
        `http://localhost:5000/imposters/${formValues.port}/stubs`,
        formattedImposterData //this object should be a stub but is passing imposter ex. formattedImposterData.stubs
      )
      .pipe(
        switchMap((response) => {
          //console.log(response); //name doesnt update because it is not inside stub, it is in imposter
          if (response) {
            return this.http.post(
              "http://localhost:3000/updateImposter",
              response //response returned is the imposter object from MB //formattedImposterData
            );
          } else {
            return throwError(response);
          }
        })
      );
  }

  formatImposterData(formValues: any) {
    const stubs = this.stubs.map((stub) => {
      let predicates = [];
      if (!stub.proxy) {
        predicates = stub.predicates.map((predicate) => {
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
                predicateObj[operator].equals['headers'] = JSON.parse(predicate.headers) || {};
                predicateObj[operator].equals['query'] = query;
                break;
              case('POST'):
              case('PUT'):
              case('PATCH'):
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
                predicateObj[operator]['headers'] = JSON.parse(predicate.headers) || {};
                predicateObj[operator]['query'] = query;
                break;
              case('POST'):
              case('PUT'):
              case('PATCH'):
                predicateObj[operator]['headers'] = JSON.parse(predicate.headers) || {};
                predicateObj[operator]['body'] =  JSON.parse(predicate.body) || {};
                break;
            }
            return predicateObj;
          }
        });
      }

      const responses = stub.responses.map((response) => {
        const statusCode = response.statusCode;
        const headers = JSON.parse(response.headers) || {};
        const body = response.body ? JSON.parse(response.body) : {};
        const proxy = stub.proxy;
        const proxyTo = response.proxyTo;

        return proxy 
          ? { proxy: { to: proxyTo, mode: "proxyTransparent" } }
          : { is: { statusCode: statusCode, headers: headers, body: body } };
      });
      return stub.proxy 
        ? { responses: responses }
        : {
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
    return this.http
      .post(`http://localhost:5000/imposters`, data)
      .pipe(
        switchMap((imposterAdded) => {
          return this.http.post(
            "http://localhost:3000/addImposter",
            imposterAdded
          );
        })
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

  getDeletedImposters() {
    return this.http.get(`http://localhost:3000/getAllDeletedImposters`);
  }

  onRestoreDeletedImposter(port: number) {
    return this.http.post(`http://localhost:3000/restoreDeletedImposter`, {
      port: port,
    });
  }
}
