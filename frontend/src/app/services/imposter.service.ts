import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { Predicate } from '../models/predicate';

@Injectable()
export class ImposterService {
    private imposterArray: any = null;
    private predicates: Predicate[] = [];


    constructor(private http: HttpClient) { }

    onGetPredicates() {
        return this.predicates.slice();
    }

    onAddPredicate({ operator,  method, path, data, newOperator, query }: Predicate) {
        this.predicates.push({ operator, method, path, data, newOperator, query });
    }

    onResetPredicates() {
        this.predicates = [];
    }

    onDeletePredicate(index) {
        this.predicates.splice(index, 1);
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
            console.log(operator);
            /**
             * TODO: same for NOT opertor
             */

            if(operator === "or" || operator === "and"){
                console.log(predicate.newOperator);
                return {
                    [operator]: [
                        {
                            [predicate.newOperator]: {
                                method: predicate.method,
                                path: predicate.path,
                                data: predicate.data
                            }
                        }
                    ]
                }
            }else {
                return {
                    [operator]: {
                        method: predicate.method,
                        path: predicate.path,
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
        console.log(data);
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
}
