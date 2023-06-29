import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { Predicate } from '../models/predicate';

@Injectable()
export class ImposterService {
    private imposterArray: any = null;
    private predicates = [];
    private subPredicates = [];
    private responses = [];

    constructor(private http: HttpClient) { }

    setOperator(operator) {
        this.subPredicates.push(operator);
    }

    onGetPredicates() {
        return this.predicates.slice();
    }

    onGetResponses() {
        return this.responses.slice();
    }

    onAddPredicate({ operator,  method, path, newpath,data, newOperator, query }: Predicate) {
        this.predicates.push({ operator, method, path, newpath, data, newOperator, query });
    }

    onAddResponse({ statusCode, headers, body }) {
        this.responses.push({ statusCode, headers, body });
    }

    onResetPredicates() {
        this.predicates = [];
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
        const headers = JSON.parse(formValues.headers);
        const body = JSON.parse(formValues.body);
        const predicates = this.predicates.map((predicate) => {
            const operator = predicate.operator;
            const query = JSON.parse(predicate.query);
            /**
             * TODO: same for NOT opertor
             */
            let updatePath;
            if(predicate.path == 'other'){
                updatePath = predicate.newpath;
                
            }else{
                updatePath = predicate.path;
            }

            if(operator === "or" || operator === "and"){
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
            }else {
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
        //updating statusCode
        let code;
        switch(formValues.statusCode){
            case 'Informational responses (100 to 199)': code = formValues.infoCode;
            break;
            case 'Successful responses (200 to 299)': code = formValues.successCode;
            break;
            case 'Redirection messages (300 to 399)': code = formValues.redirectCode;
            break;
            case 'Client error responses (400 to 499)': code = formValues.clientCode;
            break;
            case 'Server error responses (500 to 599)': code = formValues.serverCode;
            break;
        };

        const data = {
            port: formValues.port,
            protocol: formValues.protocol,
            name: formValues.name,
            stubs: [
                {
                    responses: [
                        {
                            is: {
                                statusCode: code,
                                headers: headers,
                                body: body,
                            },
                        },
                    ],
                    predicates: predicates
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

    onExportImposter(data){
        const url = `http://localhost:5000/imposters/${data}/_postman`;
        this.http.get(url, {responseType: 'text'}).subscribe((res) => {
            const blob = new Blob([res], {type: 'application/json'});
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');

            a.href = url;
            a.download = `imposter-${data}.json`;
            window.URL.revokeObjectURL(url);
        });
    }
    
}
