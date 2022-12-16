import { ImposterService } from "../services/imposter.service";
import * as ImposterActions from  "./imposter.actions";

let imposterService: ImposterService;
const initialState = [];

export function imposterReducer(state = initialState, action: ImposterActions.AddImposter) {
    switch (action.type) {
        case ImposterActions.ADD_IMPOSTER:
        return {
            ...state, 
            action
        }
    }
}