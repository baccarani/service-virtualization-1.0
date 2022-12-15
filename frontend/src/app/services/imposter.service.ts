import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from "rxjs/operators";


@Injectable()
export class ImposterService {
    private imposterArray: any = [];
    imposterChanged = new Subject<any>();


    constructor(private http: HttpClient) { }



    onGetImposter() {
        return this.http
            .get(`http://localhost:5000/imposters`)
            .pipe(map((responseData) => {
                this.imposterArray = responseData;
                this.imposterArray = this.imposterArray.imposters;
                return this.imposterArray;
            }))
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


    onAddImposter(data) {
        this.http
            .post(`http://localhost:5000/imposters`, data)
            .subscribe(responseData => {
                this.imposterArray.push(responseData);
            });
    }
}



