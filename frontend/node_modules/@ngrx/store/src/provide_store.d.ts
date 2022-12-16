import { Inject, InjectionToken, Injector, Optional, Provider } from '@angular/core';
import { Action, ActionReducer, ActionReducerMap, EnvironmentProviders } from './models';
import { combineReducers, createReducerFactory } from './utils';
import { FeatureSlice, RootStoreConfig, StoreConfig, _concatMetaReducers, _createFeatureReducers, _createFeatureStore, _createStoreReducers, _provideForRootGuard } from './store_config';
export declare function provideState<T, V extends Action = Action>(featureName: string, reducers: ActionReducerMap<T, V> | InjectionToken<ActionReducerMap<T, V>>, config?: StoreConfig<T, V> | InjectionToken<StoreConfig<T, V>>): EnvironmentProviders;
export declare function provideState<T, V extends Action = Action>(featureName: string, reducer: ActionReducer<T, V> | InjectionToken<ActionReducer<T, V>>, config?: StoreConfig<T, V> | InjectionToken<StoreConfig<T, V>>): EnvironmentProviders;
export declare function provideState<T, V extends Action = Action>(slice: FeatureSlice<T, V>): EnvironmentProviders;
export declare function _provideStore(reducers: ActionReducerMap<any, any> | InjectionToken<ActionReducerMap<any, any>>, config: RootStoreConfig<any, any>): (Provider[] | {
    provide: InjectionToken<void>;
    useFactory: typeof _provideForRootGuard;
    deps: Optional[][];
    useValue?: undefined;
    useExisting?: undefined;
} | {
    provide: InjectionToken<unknown>;
    useValue: import("./models").InitialState<any> | undefined;
    useFactory?: undefined;
    deps?: undefined;
    useExisting?: undefined;
} | {
    provide: InjectionToken<unknown>;
    useExisting: InjectionToken<unknown>;
    useFactory?: undefined;
    deps?: undefined;
    useValue?: undefined;
} | {
    provide: InjectionToken<unknown>;
    deps: (InjectionToken<unknown> | typeof Injector | Inject[])[];
    useFactory: typeof _createStoreReducers;
    useValue?: undefined;
    useExisting?: undefined;
} | {
    provide: InjectionToken<import("./models").MetaReducer<any, Action>>;
    deps: InjectionToken<import("./models").MetaReducer<any, Action>[]>[];
    useFactory: typeof _concatMetaReducers;
    useValue?: undefined;
    useExisting?: undefined;
} | {
    provide: InjectionToken<unknown>;
    deps: InjectionToken<unknown>[];
    useFactory: typeof createReducerFactory;
    useValue?: undefined;
    useExisting?: undefined;
})[];
export declare function provideStore<T, V extends Action = Action>(reducers?: ActionReducerMap<T, V> | InjectionToken<ActionReducerMap<T, V>>, config?: RootStoreConfig<T, V>): EnvironmentProviders;
export declare function _provideState(featureNameOrSlice: string | FeatureSlice<any, any>, reducers?: ActionReducerMap<any, any> | InjectionToken<ActionReducerMap<any, any>> | ActionReducer<any, any> | InjectionToken<ActionReducer<any, any>>, config?: StoreConfig<any, any> | InjectionToken<StoreConfig<any, any>>): (Provider[] | {
    provide: InjectionToken<unknown>;
    multi: boolean;
    useValue: StoreConfig<any, any> | InjectionToken<StoreConfig<any, any>>;
    deps?: undefined;
    useFactory?: undefined;
    useExisting?: undefined;
} | {
    provide: InjectionToken<unknown>;
    multi: boolean;
    useValue: {
        key: string;
        reducerFactory: import("./models").ActionReducerFactory<any, any> | typeof combineReducers;
        metaReducers: import("./models").MetaReducer<{
            [x: string]: any;
        }, any>[];
        initialState: Partial<any> | undefined;
    };
    deps?: undefined;
    useFactory?: undefined;
    useExisting?: undefined;
} | {
    provide: InjectionToken<unknown>;
    deps: (InjectionToken<unknown> | typeof Injector)[];
    useFactory: typeof _createFeatureStore;
    multi?: undefined;
    useValue?: undefined;
    useExisting?: undefined;
} | {
    provide: InjectionToken<unknown>;
    multi: boolean;
    useValue: ActionReducer<any, any> | ActionReducerMap<any, any> | InjectionToken<ActionReducerMap<any, any>> | undefined;
    deps?: undefined;
    useFactory?: undefined;
    useExisting?: undefined;
} | {
    provide: InjectionToken<unknown>;
    multi: boolean;
    useExisting: InjectionToken<unknown>;
    useValue?: undefined;
    deps?: undefined;
    useFactory?: undefined;
} | {
    provide: InjectionToken<unknown>;
    multi: boolean;
    deps: (InjectionToken<unknown> | typeof Injector | Inject[])[];
    useFactory: typeof _createFeatureReducers;
    useValue?: undefined;
    useExisting?: undefined;
})[];
