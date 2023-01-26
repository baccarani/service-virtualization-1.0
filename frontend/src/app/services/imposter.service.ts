import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";

@Injectable()
export class ImposterService {
    private imposterArray: any = null;


    constructor(private http: HttpClient) { }



    onGetImposter() {
        return this.imposterArray = this.http
            .get(`http://localhost:5000/imposters`)
            .pipe(map((responseData) => {
                this.imposterArray = responseData;
                this.imposterArray = this.imposterArray.imposters;
                return this.imposterArray;
            }));;
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

    0
    // onAddImposter(data) {
    //     this.http
    //         .post(`http://localhost:5000/imposters`, data)
    //         .subscribe(responseData => {
    //             this.imposterArray.push(responseData);
    //             this.imposterArray.sort((a, b) => {
    //                 return a.port - b.port;
    //             });
    //         });
    // }


    createImposter(formValues) {
        const data = {
            port: formValues.port,
            protocol: formValues.protocol,
            name: formValues.name,
            stubs: [{
                responses: [{
                    is: {
                        statusCode: formValues.statusCode,
                        headers: formValues.headers,
                        body: formValues.body
                    }
                }],
                predicates: [{
                    and: [{
                        equals: {
                            method: formValues.method,
                            path: formValues.path
                        }
                    }]
                }]
            }]
        };

        this.http
            .post(`http://localhost:5000/imposters`, data)
            .subscribe(responseData => {
                this.imposterArray.push(responseData);
                this.imposterArray.sort((a, b) => {
                    return a.port - b.port;
                });
            });
    }
}



