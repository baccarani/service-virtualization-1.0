import { ImposterService } from "../services/imposter.service";
import * as ImposterActions from "./imposter.actions";

let imposterService: ImposterService;
const initialState = {
    imposters: []
};

export function imposterReducer(state = initialState, action: ImposterActions.ImposterActions) {
    switch (action.type) {
        case ImposterActions.ADD_IMPOSTER:
            return {
                ...state,
                action
            };
        case ImposterActions.GET_IMPOSTER:
            return {
                ...state,
                imposters: [state]
            }
        default:
            return state;
    }
}