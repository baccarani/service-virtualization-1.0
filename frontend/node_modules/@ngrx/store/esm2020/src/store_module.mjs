import { NgModule, Inject, Optional, } from '@angular/core';
import { FEATURE_REDUCERS, _STORE_FEATURES, _ROOT_STORE_GUARD, _ACTION_TYPE_UNIQUENESS_CHECK, } from './tokens';
import { _initialStateFactory, } from './store_config';
import { _provideState, _provideStore } from './provide_store';
import * as i0 from "@angular/core";
import * as i1 from "./actions_subject";
import * as i2 from "./reducer_manager";
import * as i3 from "./scanned_actions_subject";
import * as i4 from "./store";
export class StoreRootModule {
    constructor(actions$, reducer$, scannedActions$, store, guard, actionCheck) { }
}
/** @nocollapse */ StoreRootModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: StoreRootModule, deps: [{ token: i1.ActionsSubject }, { token: i2.ReducerObservable }, { token: i3.ScannedActionsSubject }, { token: i4.Store }, { token: _ROOT_STORE_GUARD, optional: true }, { token: _ACTION_TYPE_UNIQUENESS_CHECK, optional: true }], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ StoreRootModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.2", ngImport: i0, type: StoreRootModule });
/** @nocollapse */ StoreRootModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: StoreRootModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: StoreRootModule, decorators: [{
            type: NgModule,
            args: [{}]
        }], ctorParameters: function () { return [{ type: i1.ActionsSubject }, { type: i2.ReducerObservable }, { type: i3.ScannedActionsSubject }, { type: i4.Store }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [_ROOT_STORE_GUARD]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [_ACTION_TYPE_UNIQUENESS_CHECK]
                }] }]; } });
export class StoreFeatureModule {
    constructor(features, featureReducers, reducerManager, root, actionCheck) {
        this.features = features;
        this.featureReducers = featureReducers;
        this.reducerManager = reducerManager;
        const feats = features.map((feature, index) => {
            const featureReducerCollection = featureReducers.shift();
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const reducers = featureReducerCollection /*TODO(#823)*/[index];
            return {
                ...feature,
                reducers,
                initialState: _initialStateFactory(feature.initialState),
            };
        });
        reducerManager.addFeatures(feats);
    }
    // eslint-disable-next-line @angular-eslint/contextual-lifecycle
    ngOnDestroy() {
        this.reducerManager.removeFeatures(this.features);
    }
}
/** @nocollapse */ StoreFeatureModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: StoreFeatureModule, deps: [{ token: _STORE_FEATURES }, { token: FEATURE_REDUCERS }, { token: i2.ReducerManager }, { token: StoreRootModule }, { token: _ACTION_TYPE_UNIQUENESS_CHECK, optional: true }], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ StoreFeatureModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.2", ngImport: i0, type: StoreFeatureModule });
/** @nocollapse */ StoreFeatureModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: StoreFeatureModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: StoreFeatureModule, decorators: [{
            type: NgModule,
            args: [{}]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [_STORE_FEATURES]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [FEATURE_REDUCERS]
                }] }, { type: i2.ReducerManager }, { type: StoreRootModule }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [_ACTION_TYPE_UNIQUENESS_CHECK]
                }] }]; } });
export class StoreModule {
    static forRoot(reducers, config = {}) {
        return {
            ngModule: StoreRootModule,
            providers: [..._provideStore(reducers, config)],
        };
    }
    static forFeature(featureNameOrSlice, reducers, config = {}) {
        return {
            ngModule: StoreFeatureModule,
            providers: [..._provideState(featureNameOrSlice, reducers, config)],
        };
    }
}
/** @nocollapse */ StoreModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: StoreModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ StoreModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.2", ngImport: i0, type: StoreModule });
/** @nocollapse */ StoreModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: StoreModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: StoreModule, decorators: [{
            type: NgModule,
            args: [{}]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmVfbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9zdG9yZS9zcmMvc3RvcmVfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxRQUFRLEVBQ1IsTUFBTSxFQUlOLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQU92QixPQUFPLEVBS0wsZ0JBQWdCLEVBR2hCLGVBQWUsRUFHZixpQkFBaUIsRUFDakIsNkJBQTZCLEdBQzlCLE1BQU0sVUFBVSxDQUFDO0FBS2xCLE9BQU8sRUFJTCxvQkFBb0IsR0FDckIsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxNQUFNLGlCQUFpQixDQUFDOzs7Ozs7QUFHL0QsTUFBTSxPQUFPLGVBQWU7SUFDMUIsWUFDRSxRQUF3QixFQUN4QixRQUEyQixFQUMzQixlQUFzQyxFQUN0QyxLQUFpQixFQUdqQixLQUFVLEVBR1YsV0FBZ0IsSUFDZixDQUFDOzsrSEFaTyxlQUFlLDJJQU9oQixpQkFBaUIsNkJBR2pCLDZCQUE2QjtnSUFWNUIsZUFBZTtnSUFBZixlQUFlOzJGQUFmLGVBQWU7a0JBRDNCLFFBQVE7bUJBQUMsRUFBRTs7MEJBT1AsUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQyxpQkFBaUI7OzBCQUV4QixRQUFROzswQkFDUixNQUFNOzJCQUFDLDZCQUE2Qjs7QUFNekMsTUFBTSxPQUFPLGtCQUFrQjtJQUM3QixZQUNtQyxRQUFrQyxFQUNqQyxlQUF3QyxFQUNsRSxjQUE4QixFQUN0QyxJQUFxQixFQUdyQixXQUFnQjtRQU5pQixhQUFRLEdBQVIsUUFBUSxDQUEwQjtRQUNqQyxvQkFBZSxHQUFmLGVBQWUsQ0FBeUI7UUFDbEUsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBTXRDLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDNUMsTUFBTSx3QkFBd0IsR0FBRyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDekQsb0VBQW9FO1lBQ3BFLE1BQU0sUUFBUSxHQUFHLHdCQUF5QixDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUVqRSxPQUFPO2dCQUNMLEdBQUcsT0FBTztnQkFDVixRQUFRO2dCQUNSLFlBQVksRUFBRSxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO2FBQ3pELENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztRQUVILGNBQWMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELGdFQUFnRTtJQUNoRSxXQUFXO1FBQ1QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BELENBQUM7O2tJQTVCVSxrQkFBa0Isa0JBRW5CLGVBQWUsYUFDZixnQkFBZ0IsdUVBSWhCLDZCQUE2QjttSUFQNUIsa0JBQWtCO21JQUFsQixrQkFBa0I7MkZBQWxCLGtCQUFrQjtrQkFEOUIsUUFBUTttQkFBQyxFQUFFOzswQkFHUCxNQUFNOzJCQUFDLGVBQWU7OzBCQUN0QixNQUFNOzJCQUFDLGdCQUFnQjs7MEJBR3ZCLFFBQVE7OzBCQUNSLE1BQU07MkJBQUMsNkJBQTZCOztBQXlCekMsTUFBTSxPQUFPLFdBQVc7SUFLdEIsTUFBTSxDQUFDLE9BQU8sQ0FDWixRQUU4QyxFQUM5QyxTQUFvQyxFQUFFO1FBRXRDLE9BQU87WUFDTCxRQUFRLEVBQUUsZUFBZTtZQUN6QixTQUFTLEVBQUUsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDaEQsQ0FBQztJQUNKLENBQUM7SUFlRCxNQUFNLENBQUMsVUFBVSxDQUNmLGtCQUFtRCxFQUNuRCxRQUkyQyxFQUMzQyxTQUF3RSxFQUFFO1FBRTFFLE9BQU87WUFDTCxRQUFRLEVBQUUsa0JBQWtCO1lBQzVCLFNBQVMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLGtCQUFrQixFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNwRSxDQUFDO0lBQ0osQ0FBQzs7MkhBM0NVLFdBQVc7NEhBQVgsV0FBVzs0SEFBWCxXQUFXOzJGQUFYLFdBQVc7a0JBRHZCLFFBQVE7bUJBQUMsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIE5nTW9kdWxlLFxuICBJbmplY3QsXG4gIE1vZHVsZVdpdGhQcm92aWRlcnMsXG4gIE9uRGVzdHJveSxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIE9wdGlvbmFsLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEFjdGlvbixcbiAgQWN0aW9uUmVkdWNlcixcbiAgQWN0aW9uUmVkdWNlck1hcCxcbiAgU3RvcmVGZWF0dXJlLFxufSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQge1xuICBfSU5JVElBTF9SRURVQ0VSUyxcbiAgX1JFRFVDRVJfRkFDVE9SWSxcbiAgX0lOSVRJQUxfU1RBVEUsXG4gIF9TVE9SRV9SRURVQ0VSUyxcbiAgRkVBVFVSRV9SRURVQ0VSUyxcbiAgX0ZFQVRVUkVfUkVEVUNFUlMsXG4gIF9GRUFUVVJFX1JFRFVDRVJTX1RPS0VOLFxuICBfU1RPUkVfRkVBVFVSRVMsXG4gIF9GRUFUVVJFX0NPTkZJR1MsXG4gIF9SRVNPTFZFRF9NRVRBX1JFRFVDRVJTLFxuICBfUk9PVF9TVE9SRV9HVUFSRCxcbiAgX0FDVElPTl9UWVBFX1VOSVFVRU5FU1NfQ0hFQ0ssXG59IGZyb20gJy4vdG9rZW5zJztcbmltcG9ydCB7IEFjdGlvbnNTdWJqZWN0IH0gZnJvbSAnLi9hY3Rpb25zX3N1YmplY3QnO1xuaW1wb3J0IHsgUmVkdWNlck1hbmFnZXIsIFJlZHVjZXJPYnNlcnZhYmxlIH0gZnJvbSAnLi9yZWR1Y2VyX21hbmFnZXInO1xuaW1wb3J0IHsgU2Nhbm5lZEFjdGlvbnNTdWJqZWN0IH0gZnJvbSAnLi9zY2FubmVkX2FjdGlvbnNfc3ViamVjdCc7XG5pbXBvcnQgeyBTdG9yZSB9IGZyb20gJy4vc3RvcmUnO1xuaW1wb3J0IHtcbiAgRmVhdHVyZVNsaWNlLFxuICBSb290U3RvcmVDb25maWcsXG4gIFN0b3JlQ29uZmlnLFxuICBfaW5pdGlhbFN0YXRlRmFjdG9yeSxcbn0gZnJvbSAnLi9zdG9yZV9jb25maWcnO1xuaW1wb3J0IHsgX3Byb3ZpZGVTdGF0ZSwgX3Byb3ZpZGVTdG9yZSB9IGZyb20gJy4vcHJvdmlkZV9zdG9yZSc7XG5cbkBOZ01vZHVsZSh7fSlcbmV4cG9ydCBjbGFzcyBTdG9yZVJvb3RNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBhY3Rpb25zJDogQWN0aW9uc1N1YmplY3QsXG4gICAgcmVkdWNlciQ6IFJlZHVjZXJPYnNlcnZhYmxlLFxuICAgIHNjYW5uZWRBY3Rpb25zJDogU2Nhbm5lZEFjdGlvbnNTdWJqZWN0LFxuICAgIHN0b3JlOiBTdG9yZTxhbnk+LFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChfUk9PVF9TVE9SRV9HVUFSRClcbiAgICBndWFyZDogYW55LFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChfQUNUSU9OX1RZUEVfVU5JUVVFTkVTU19DSEVDSylcbiAgICBhY3Rpb25DaGVjazogYW55XG4gICkge31cbn1cblxuQE5nTW9kdWxlKHt9KVxuZXhwb3J0IGNsYXNzIFN0b3JlRmVhdHVyZU1vZHVsZSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoX1NUT1JFX0ZFQVRVUkVTKSBwcml2YXRlIGZlYXR1cmVzOiBTdG9yZUZlYXR1cmU8YW55LCBhbnk+W10sXG4gICAgQEluamVjdChGRUFUVVJFX1JFRFVDRVJTKSBwcml2YXRlIGZlYXR1cmVSZWR1Y2VyczogQWN0aW9uUmVkdWNlck1hcDxhbnk+W10sXG4gICAgcHJpdmF0ZSByZWR1Y2VyTWFuYWdlcjogUmVkdWNlck1hbmFnZXIsXG4gICAgcm9vdDogU3RvcmVSb290TW9kdWxlLFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChfQUNUSU9OX1RZUEVfVU5JUVVFTkVTU19DSEVDSylcbiAgICBhY3Rpb25DaGVjazogYW55XG4gICkge1xuICAgIGNvbnN0IGZlYXRzID0gZmVhdHVyZXMubWFwKChmZWF0dXJlLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgZmVhdHVyZVJlZHVjZXJDb2xsZWN0aW9uID0gZmVhdHVyZVJlZHVjZXJzLnNoaWZ0KCk7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5vbi1udWxsLWFzc2VydGlvblxuICAgICAgY29uc3QgcmVkdWNlcnMgPSBmZWF0dXJlUmVkdWNlckNvbGxlY3Rpb24hIC8qVE9ETygjODIzKSovW2luZGV4XTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZmVhdHVyZSxcbiAgICAgICAgcmVkdWNlcnMsXG4gICAgICAgIGluaXRpYWxTdGF0ZTogX2luaXRpYWxTdGF0ZUZhY3RvcnkoZmVhdHVyZS5pbml0aWFsU3RhdGUpLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJlZHVjZXJNYW5hZ2VyLmFkZEZlYXR1cmVzKGZlYXRzKTtcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvY29udGV4dHVhbC1saWZlY3ljbGVcbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5yZWR1Y2VyTWFuYWdlci5yZW1vdmVGZWF0dXJlcyh0aGlzLmZlYXR1cmVzKTtcbiAgfVxufVxuXG5ATmdNb2R1bGUoe30pXG5leHBvcnQgY2xhc3MgU3RvcmVNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdDxULCBWIGV4dGVuZHMgQWN0aW9uID0gQWN0aW9uPihcbiAgICByZWR1Y2VyczogQWN0aW9uUmVkdWNlck1hcDxULCBWPiB8IEluamVjdGlvblRva2VuPEFjdGlvblJlZHVjZXJNYXA8VCwgVj4+LFxuICAgIGNvbmZpZz86IFJvb3RTdG9yZUNvbmZpZzxULCBWPlxuICApOiBNb2R1bGVXaXRoUHJvdmlkZXJzPFN0b3JlUm9vdE1vZHVsZT47XG4gIHN0YXRpYyBmb3JSb290KFxuICAgIHJlZHVjZXJzOlxuICAgICAgfCBBY3Rpb25SZWR1Y2VyTWFwPGFueSwgYW55PlxuICAgICAgfCBJbmplY3Rpb25Ub2tlbjxBY3Rpb25SZWR1Y2VyTWFwPGFueSwgYW55Pj4sXG4gICAgY29uZmlnOiBSb290U3RvcmVDb25maWc8YW55LCBhbnk+ID0ge31cbiAgKTogTW9kdWxlV2l0aFByb3ZpZGVyczxTdG9yZVJvb3RNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFN0b3JlUm9vdE1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogWy4uLl9wcm92aWRlU3RvcmUocmVkdWNlcnMsIGNvbmZpZyldLFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZm9yRmVhdHVyZTxULCBWIGV4dGVuZHMgQWN0aW9uID0gQWN0aW9uPihcbiAgICBmZWF0dXJlTmFtZTogc3RyaW5nLFxuICAgIHJlZHVjZXJzOiBBY3Rpb25SZWR1Y2VyTWFwPFQsIFY+IHwgSW5qZWN0aW9uVG9rZW48QWN0aW9uUmVkdWNlck1hcDxULCBWPj4sXG4gICAgY29uZmlnPzogU3RvcmVDb25maWc8VCwgVj4gfCBJbmplY3Rpb25Ub2tlbjxTdG9yZUNvbmZpZzxULCBWPj5cbiAgKTogTW9kdWxlV2l0aFByb3ZpZGVyczxTdG9yZUZlYXR1cmVNb2R1bGU+O1xuICBzdGF0aWMgZm9yRmVhdHVyZTxULCBWIGV4dGVuZHMgQWN0aW9uID0gQWN0aW9uPihcbiAgICBmZWF0dXJlTmFtZTogc3RyaW5nLFxuICAgIHJlZHVjZXI6IEFjdGlvblJlZHVjZXI8VCwgVj4gfCBJbmplY3Rpb25Ub2tlbjxBY3Rpb25SZWR1Y2VyPFQsIFY+PixcbiAgICBjb25maWc/OiBTdG9yZUNvbmZpZzxULCBWPiB8IEluamVjdGlvblRva2VuPFN0b3JlQ29uZmlnPFQsIFY+PlxuICApOiBNb2R1bGVXaXRoUHJvdmlkZXJzPFN0b3JlRmVhdHVyZU1vZHVsZT47XG4gIHN0YXRpYyBmb3JGZWF0dXJlPFQsIFYgZXh0ZW5kcyBBY3Rpb24gPSBBY3Rpb24+KFxuICAgIHNsaWNlOiBGZWF0dXJlU2xpY2U8VCwgVj5cbiAgKTogTW9kdWxlV2l0aFByb3ZpZGVyczxTdG9yZUZlYXR1cmVNb2R1bGU+O1xuICBzdGF0aWMgZm9yRmVhdHVyZShcbiAgICBmZWF0dXJlTmFtZU9yU2xpY2U6IHN0cmluZyB8IEZlYXR1cmVTbGljZTxhbnksIGFueT4sXG4gICAgcmVkdWNlcnM/OlxuICAgICAgfCBBY3Rpb25SZWR1Y2VyTWFwPGFueSwgYW55PlxuICAgICAgfCBJbmplY3Rpb25Ub2tlbjxBY3Rpb25SZWR1Y2VyTWFwPGFueSwgYW55Pj5cbiAgICAgIHwgQWN0aW9uUmVkdWNlcjxhbnksIGFueT5cbiAgICAgIHwgSW5qZWN0aW9uVG9rZW48QWN0aW9uUmVkdWNlcjxhbnksIGFueT4+LFxuICAgIGNvbmZpZzogU3RvcmVDb25maWc8YW55LCBhbnk+IHwgSW5qZWN0aW9uVG9rZW48U3RvcmVDb25maWc8YW55LCBhbnk+PiA9IHt9XG4gICk6IE1vZHVsZVdpdGhQcm92aWRlcnM8U3RvcmVGZWF0dXJlTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBTdG9yZUZlYXR1cmVNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFsuLi5fcHJvdmlkZVN0YXRlKGZlYXR1cmVOYW1lT3JTbGljZSwgcmVkdWNlcnMsIGNvbmZpZyldLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==