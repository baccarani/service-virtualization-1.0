import { Action } from '@ngrx/store';

export const ADD_IMPOSTER = 'ADD_IMPOSTER';
export const GET_IMPOSTER = 'GET_IMPOSTER';



export class AddImposter implements Action {
    readonly type = ADD_IMPOSTER;
    
    constructor(public payload: any) {}
}


export class GetImposter implements Action {
    readonly type = GET_IMPOSTER;
    
    constructor(public payload: any) {}
}


export type ImposterActions = AddImposter | GetImposter;