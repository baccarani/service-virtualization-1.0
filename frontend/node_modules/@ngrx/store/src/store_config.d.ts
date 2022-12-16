import { InjectionToken, Injector } from '@angular/core';
import { Action, ActionReducer, ActionReducerMap, ActionReducerFactory, StoreFeature, InitialState, MetaReducer, RuntimeChecks } from './models';
import { Store } from './store';
export interface StoreConfig<T, V extends Action = Action> {
    initialState?: InitialState<T>;
    reducerFactory?: ActionReducerFactory<T, V>;
    metaReducers?: MetaReducer<{
        [P in keyof T]: T[P];
    }, V>[];
}
export interface RootStoreConfig<T, V extends Action = Action> extends StoreConfig<T, V> {
    runtimeChecks?: Partial<RuntimeChecks>;
}
/**
 * An object with the name and the reducer for the feature.
 */
export interface FeatureSlice<T, V extends Action = Action> {
    name: string;
    reducer: ActionReducer<T, V>;
}
export declare function _createStoreReducers(injector: Injector, reducers: ActionReducerMap<any, any>): unknown;
export declare function _createFeatureStore(injector: Injector, configs: StoreConfig<any, any>[] | InjectionToken<StoreConfig<any, any>>[], featureStores: StoreFeature<any, any>[]): (StoreFeature<any, any> | {
    key: string;
    reducerFactory: any;
    metaReducers: any;
    initialState: any;
})[];
export declare function _createFeatureReducers(injector: Injector, reducerCollection: ActionReducerMap<any, any>[]): unknown[];
export declare function _initialStateFactory(initialState: any): any;
export declare function _concatMetaReducers(metaReducers: MetaReducer[], userProvidedMetaReducers: MetaReducer[]): MetaReducer[];
export declare function _provideForRootGuard(store: Store<any>): any;
