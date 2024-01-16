import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
// import { Predicate } from '../models/predicate';
// import { Stubs } from '../models/stubs';

@Injectable()
export class ImposterService {
    private imposterArray: any = null;
    private stubs = [];
    private predicates = [];
    private responses = [];
    // private subPredicates = [];

    constructor(private http: HttpClient) { }

    setDefaultStubs() {
        if (this.stubs.length === 0) {
            const defaultStubs = { stubID: Date.now(), predicates: [{ predicateID: Date.now(), operator: '', method: '', path: '', newpath: '', data: '', newOperator: '', query: '' }], responses: [{ responseID: Date.now(), statusCode: '', headers: '', body: '' }] }
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
        let newStub = { stubID: Date.now(), predicates: [{ predicateID: Date.now(), operator: '', method: '', path: '', newpath: '', data: '', newOperator: '', query: '' }], responses: [{ responseID: Date.now(), statusCode: '', headers: '', body: '' }] }
        this.stubs.push(newStub);
    }

    onAddPredicate(stubID: number) {
        let index = this.stubs.findIndex(stub => stub.stubID === stubID);
        this.stubs[index].predicates.push({ predicateID: Date.now(), operator: '', method: '', path: '', newpath: '', data: '', newOperator: '', query: '' });
    }

    onAddResponse(stubID: number) {
        let index = this.stubs.findIndex(stub => stub.stubID === stubID);
        this.stubs[index].responses.push({ responseID: Date.now(), statusCode: '', headers: '', body: '' });
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
        let index = this.stubs.findIndex(stub => stub.stubID === stubID);
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
        let imposterArray$ = [];
        this.imposterArray = this.http
            .get(`http://localhost:5000/imposters`)
            .pipe(map((responseData) => {
                this.imposterArray = responseData;
                this.imposterArray = this.imposterArray.imposters;
                for (let index = 0; index < this.imposterArray.length; index++) {
                    this.http.get(`http://localhost:5000/imposters/${this.imposterArray[index].port}`).subscribe(data => {
                        imposterArray$.push(data);
                        imposterArray$.sort((a, b) => a.port - b.port);
                    })
                }
                return this.imposterArray = imposterArray$;
            }))
        return this.imposterArray;
    }

    onViewImposter(data) {
        return this.http
            .get(`http://localhost:5000/imposters/${data}`)
    }

    onDeleteImposter(port, index) {
        this.http
            .delete(`http://localhost:5000/imposters/${port}`)
            .subscribe(data => {
                this.imposterArray.splice(index, 1);
            })
    }

    onCreateImposter(formValues) {
        const stubs = this.stubs.map((stub) => {
            const predicates = stub.predicates.map((predicate) => {
                const operator = predicate.operator;
                const query = JSON.parse(predicate.query) || {};
                let updatePath;
                if (predicate.path == 'other') {
                    updatePath = predicate.newpath;
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
                                    data: predicate.data
                                }
                            }
                        ]
                    }
                } else {
                    return {
                        [operator]: {
                            method: predicate.method,
                            path: updatePath,
                            query: query
                        },
                    };
                }
            });
    
            const responses = stub.responses.map((response) => {
                const statusCode = response.statusCode;
                const headers = JSON.parse(response.headers) || {};
                const body = JSON.parse(response.body) || {};
    
                return {
                    is: { statusCode: statusCode, headers: headers, body: body },
                }
            });
    
            return {
                predicates: predicates,
                responses: responses
            };
        });
    
        const data = {
            port: formValues.port,
            protocol: formValues.protocol,
            name: formValues.name,
            stubs: stubs
        };

        this.http.post(`http://localhost:5000/imposters`, data).subscribe(
            (responseData) => {
                this.imposterArray.push(responseData);
                this.imposterArray.sort((a, b) => {
                    return a.port - b.port;
                });
            },
            (error) => {
                console.error(error);
            }
        );
    }

    onExportImposter(data) {
        const url = `http://localhost:5000/imposters/${data}/_postman`;
        this.http.get(url, { responseType: 'text' }).subscribe((res) => {
            const blob = new Blob([res], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');

            a.href = url;
            a.download = `imposter-${data}.json`;
            window.URL.revokeObjectURL(url);
        });
    }
}