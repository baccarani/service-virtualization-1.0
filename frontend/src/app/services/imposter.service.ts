import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { Predicate } from '../models/predicate';
import { Stubs } from '../models/stubs';

@Injectable()
export class ImposterService {
    private imposterArray: any = null;
    private predicates = [];
    private subPredicates = [];
    private responses = [];
    private stubs = [];

    constructor(private http: HttpClient) { }

    setOperator(operator) {
        this.subPredicates.push(operator);
    }

    onGetPredicates() {
        console.log(this.predicates)
        console.log(this.stubs)
        return this.predicates.slice();
    }

    onGetResponses() {
        return this.responses.slice();
    }

    onGetStubs() {
        return this.stubs.slice();
    }

    onAddStub(stub: any, i: number) {
        if (this.stubs.length === 0) {
            this.stubs.push({predicates: this.predicates, responses: this.responses })
        } else {
            // this.stubs.push(stub);
            console.log(i)
            this.stubs[i] = stub;
        }
    }

    onAddPredicate({ operator, method, path, newpath, data, newOperator, query }: Predicate, i: number) {
        if (this.predicates.length <= i) {
            // Add new predicate to the end of the array
            console.log('if', i)
            console.log(this.stubs)
            this.predicates.push({ operator, method, path, newpath, data, newOperator, query });
        } else {
            // Update existing predicate
            console.log('else', i)
            this.predicates[i] = { operator, method, path, newpath, data, newOperator, query };
        }
    }

    onAddResponse({ statusCode, headers, body }, i: number) {
        if (this.responses.length <= i) {
            // Add new response to the end of the array
            this.responses.push({ statusCode, headers, body });
        } else {
            // Update existing response
            this.responses[i] = { statusCode, headers, body };
        }
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

    onDeleteStub(index) {
        this.stubs.splice(index, 1);
    }

    onDeletePredicate(index) {
        this.predicates.splice(index, 1);
    }

    onDeleteResponse(index) {
        this.responses.splice(index, 1);
    }

    onDeleteSubPredicate(index) {
        this.subPredicates.splice(index, 1);
    }

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
        const predicates = this.predicates.map((predicate) => {
            const operator = predicate.operator;
            const query = JSON.parse(predicate.query);
            /**
             * TODO: same for NOT opertor
             */
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
                        data: predicate.data,
                        query: query
                    },
                };
            }
        });

        const responses = this.responses.map((response) => {
            const statusCode = response.statusCode;
            const headers = JSON.parse(response.headers);
            const body = JSON.parse(response.body);

            return {
                is: { statusCode: statusCode, headers: headers, body: body },
            }
        });

        const data = {
            port: formValues.port,
            protocol: formValues.protocol,
            name: formValues.name,
            stubs: [
                {
                    predicates: predicates,
                    responses: responses,
                },
            ],
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




