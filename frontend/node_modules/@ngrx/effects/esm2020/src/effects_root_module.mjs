import { NgModule, Inject, Optional } from '@angular/core';
import { ROOT_EFFECTS, _ROOT_EFFECTS_GUARD } from './tokens';
import { ROOT_EFFECTS_INIT } from './effects_actions';
import * as i0 from "@angular/core";
import * as i1 from "./effect_sources";
import * as i2 from "./effects_runner";
import * as i3 from "@ngrx/store";
export class EffectsRootModule {
    constructor(sources, runner, store, rootEffects, storeRootModule, storeFeatureModule, guard) {
        this.sources = sources;
        runner.start();
        rootEffects.forEach((effectSourceInstance) => sources.addEffects(effectSourceInstance));
        store.dispatch({ type: ROOT_EFFECTS_INIT });
    }
    addEffects(effectSourceInstance) {
        this.sources.addEffects(effectSourceInstance);
    }
}
/** @nocollapse */ EffectsRootModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: EffectsRootModule, deps: [{ token: i1.EffectSources }, { token: i2.EffectsRunner }, { token: i3.Store }, { token: ROOT_EFFECTS }, { token: i3.StoreRootModule, optional: true }, { token: i3.StoreFeatureModule, optional: true }, { token: _ROOT_EFFECTS_GUARD, optional: true }], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ EffectsRootModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.2", ngImport: i0, type: EffectsRootModule });
/** @nocollapse */ EffectsRootModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: EffectsRootModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: EffectsRootModule, decorators: [{
            type: NgModule,
            args: [{}]
        }], ctorParameters: function () { return [{ type: i1.EffectSources }, { type: i2.EffectsRunner }, { type: i3.Store }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [ROOT_EFFECTS]
                }] }, { type: i3.StoreRootModule, decorators: [{
                    type: Optional
                }] }, { type: i3.StoreFeatureModule, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [_ROOT_EFFECTS_GUARD]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWZmZWN0c19yb290X21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvZWZmZWN0cy9zcmMvZWZmZWN0c19yb290X21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFJM0QsT0FBTyxFQUFFLFlBQVksRUFBRSxtQkFBbUIsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUM3RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQzs7Ozs7QUFHdEQsTUFBTSxPQUFPLGlCQUFpQjtJQUM1QixZQUNVLE9BQXNCLEVBQzlCLE1BQXFCLEVBQ3JCLEtBQWlCLEVBQ0ssV0FBa0IsRUFDNUIsZUFBZ0MsRUFDaEMsa0JBQXNDLEVBR2xELEtBQVU7UUFSRixZQUFPLEdBQVAsT0FBTyxDQUFlO1FBVTlCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVmLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLENBQzNDLE9BQU8sQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FDekMsQ0FBQztRQUVGLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxVQUFVLENBQUMsb0JBQXlCO1FBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFDaEQsQ0FBQzs7aUlBdkJVLGlCQUFpQixpR0FLbEIsWUFBWSw4R0FJWixtQkFBbUI7a0lBVGxCLGlCQUFpQjtrSUFBakIsaUJBQWlCOzJGQUFqQixpQkFBaUI7a0JBRDdCLFFBQVE7bUJBQUMsRUFBRTs7MEJBTVAsTUFBTTsyQkFBQyxZQUFZOzswQkFDbkIsUUFBUTs7MEJBQ1IsUUFBUTs7MEJBQ1IsUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQyxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgSW5qZWN0LCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3RvcmUsIFN0b3JlUm9vdE1vZHVsZSwgU3RvcmVGZWF0dXJlTW9kdWxlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgRWZmZWN0c1J1bm5lciB9IGZyb20gJy4vZWZmZWN0c19ydW5uZXInO1xuaW1wb3J0IHsgRWZmZWN0U291cmNlcyB9IGZyb20gJy4vZWZmZWN0X3NvdXJjZXMnO1xuaW1wb3J0IHsgUk9PVF9FRkZFQ1RTLCBfUk9PVF9FRkZFQ1RTX0dVQVJEIH0gZnJvbSAnLi90b2tlbnMnO1xuaW1wb3J0IHsgUk9PVF9FRkZFQ1RTX0lOSVQgfSBmcm9tICcuL2VmZmVjdHNfYWN0aW9ucyc7XG5cbkBOZ01vZHVsZSh7fSlcbmV4cG9ydCBjbGFzcyBFZmZlY3RzUm9vdE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgc291cmNlczogRWZmZWN0U291cmNlcyxcbiAgICBydW5uZXI6IEVmZmVjdHNSdW5uZXIsXG4gICAgc3RvcmU6IFN0b3JlPGFueT4sXG4gICAgQEluamVjdChST09UX0VGRkVDVFMpIHJvb3RFZmZlY3RzOiBhbnlbXSxcbiAgICBAT3B0aW9uYWwoKSBzdG9yZVJvb3RNb2R1bGU6IFN0b3JlUm9vdE1vZHVsZSxcbiAgICBAT3B0aW9uYWwoKSBzdG9yZUZlYXR1cmVNb2R1bGU6IFN0b3JlRmVhdHVyZU1vZHVsZSxcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoX1JPT1RfRUZGRUNUU19HVUFSRClcbiAgICBndWFyZDogYW55XG4gICkge1xuICAgIHJ1bm5lci5zdGFydCgpO1xuXG4gICAgcm9vdEVmZmVjdHMuZm9yRWFjaCgoZWZmZWN0U291cmNlSW5zdGFuY2UpID0+XG4gICAgICBzb3VyY2VzLmFkZEVmZmVjdHMoZWZmZWN0U291cmNlSW5zdGFuY2UpXG4gICAgKTtcblxuICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogUk9PVF9FRkZFQ1RTX0lOSVQgfSk7XG4gIH1cblxuICBhZGRFZmZlY3RzKGVmZmVjdFNvdXJjZUluc3RhbmNlOiBhbnkpIHtcbiAgICB0aGlzLnNvdXJjZXMuYWRkRWZmZWN0cyhlZmZlY3RTb3VyY2VJbnN0YW5jZSk7XG4gIH1cbn1cbiJdfQ==