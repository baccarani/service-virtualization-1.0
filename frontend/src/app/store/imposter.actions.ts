import { Action } from '@ngrx/store';


export const ADD_IMPOSTER = 'ADD_IMPOSTER';

export class AddImposter implements Action {
    readonly type = ADD_IMPOSTER;
    payload: any;
}