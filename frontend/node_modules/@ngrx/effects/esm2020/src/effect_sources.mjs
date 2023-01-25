import { Inject, Injectable } from '@angular/core';
import { Subject, merge } from 'rxjs';
import { dematerialize, exhaustMap, filter, groupBy, map, mergeMap, take, } from 'rxjs/operators';
import { reportInvalidActions, } from './effect_notification';
import { mergeEffects } from './effects_resolver';
import { isOnIdentifyEffects, isOnRunEffects, isOnInitEffects, } from './lifecycle_hooks';
import { EFFECTS_ERROR_HANDLER } from './tokens';
import { getSourceForInstance } from './utils';
import * as i0 from "@angular/core";
export class EffectSources extends Subject {
    constructor(errorHandler, effectsErrorHandler) {
        super();
        this.errorHandler = errorHandler;
        this.effectsErrorHandler = effectsErrorHandler;
    }
    addEffects(effectSourceInstance) {
        this.next(effectSourceInstance);
    }
    /**
     * @internal
     */
    toActions() {
        return this.pipe(groupBy(getSourceForInstance), mergeMap((source$) => {
            return source$.pipe(groupBy(effectsInstance));
        }), mergeMap((source$) => {
            const effect$ = source$.pipe(exhaustMap((sourceInstance) => {
                return resolveEffectSource(this.errorHandler, this.effectsErrorHandler)(sourceInstance);
            }), map((output) => {
                reportInvalidActions(output, this.errorHandler);
                return output.notification;
            }), filter((notification) => notification.kind === 'N' && notification.value != null), dematerialize());
            // start the stream with an INIT action
            // do this only for the first Effect instance
            const init$ = source$.pipe(take(1), filter(isOnInitEffects), map((instance) => instance.ngrxOnInitEffects()));
            return merge(effect$, init$);
        }));
    }
}
/** @nocollapse */ EffectSources.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: EffectSources, deps: [{ token: i0.ErrorHandler }, { token: EFFECTS_ERROR_HANDLER }], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ EffectSources.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: EffectSources, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.2", ngImport: i0, type: EffectSources, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i0.ErrorHandler }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [EFFECTS_ERROR_HANDLER]
                }] }]; } });
function effectsInstance(sourceInstance) {
    if (isOnIdentifyEffects(sourceInstance)) {
        return sourceInstance.ngrxOnIdentifyEffects();
    }
    return '';
}
function resolveEffectSource(errorHandler, effectsErrorHandler) {
    return (sourceInstance) => {
        const mergedEffects$ = mergeEffects(sourceInstance, errorHandler, effectsErrorHandler);
        if (isOnRunEffects(sourceInstance)) {
            return sourceInstance.ngrxOnRunEffects(mergedEffects$);
        }
        return mergedEffects$;
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWZmZWN0X3NvdXJjZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2VmZmVjdHMvc3JjL2VmZmVjdF9zb3VyY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBZ0IsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVqRSxPQUFPLEVBQWMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsRCxPQUFPLEVBQ0wsYUFBYSxFQUNiLFVBQVUsRUFDVixNQUFNLEVBQ04sT0FBTyxFQUNQLEdBQUcsRUFDSCxRQUFRLEVBQ1IsSUFBSSxHQUNMLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEIsT0FBTyxFQUNMLG9CQUFvQixHQUVyQixNQUFNLHVCQUF1QixDQUFDO0FBRS9CLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBS0wsbUJBQW1CLEVBQ25CLGNBQWMsRUFDZCxlQUFlLEdBQ2hCLE1BQU0sbUJBQW1CLENBQUM7QUFDM0IsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ2pELE9BQU8sRUFBRSxvQkFBb0IsRUFBMEIsTUFBTSxTQUFTLENBQUM7O0FBR3ZFLE1BQU0sT0FBTyxhQUFjLFNBQVEsT0FBWTtJQUM3QyxZQUNVLFlBQTBCLEVBRTFCLG1CQUF3QztRQUVoRCxLQUFLLEVBQUUsQ0FBQztRQUpBLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBRTFCLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7SUFHbEQsQ0FBQztJQUVELFVBQVUsQ0FBQyxvQkFBeUI7UUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7T0FFRztJQUNILFNBQVM7UUFDUCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQ2QsT0FBTyxDQUFDLG9CQUFvQixDQUFDLEVBQzdCLFFBQVEsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ25CLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsRUFDRixRQUFRLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUNuQixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUMxQixVQUFVLENBQUMsQ0FBQyxjQUFjLEVBQUUsRUFBRTtnQkFDNUIsT0FBTyxtQkFBbUIsQ0FDeEIsSUFBSSxDQUFDLFlBQVksRUFDakIsSUFBSSxDQUFDLG1CQUFtQixDQUN6QixDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxFQUNGLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNiLG9CQUFvQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ2hELE9BQU8sTUFBTSxDQUFDLFlBQVksQ0FBQztZQUM3QixDQUFDLENBQUMsRUFDRixNQUFNLENBQ0osQ0FBQyxZQUFZLEVBQWtELEVBQUUsQ0FDL0QsWUFBWSxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksWUFBWSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQzFELEVBQ0QsYUFBYSxFQUFFLENBQ2hCLENBQUM7WUFFRix1Q0FBdUM7WUFDdkMsNkNBQTZDO1lBQzdDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQ3hCLElBQUksQ0FBQyxDQUFDLENBQUMsRUFDUCxNQUFNLENBQUMsZUFBZSxDQUFDLEVBQ3ZCLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FDaEQsQ0FBQztZQUVGLE9BQU8sS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQzs7NkhBcERVLGFBQWEsOENBR2QscUJBQXFCO2lJQUhwQixhQUFhLGNBREEsTUFBTTsyRkFDbkIsYUFBYTtrQkFEekIsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7OzBCQUk3QixNQUFNOzJCQUFDLHFCQUFxQjs7QUFvRGpDLFNBQVMsZUFBZSxDQUFDLGNBQW1CO0lBQzFDLElBQUksbUJBQW1CLENBQUMsY0FBYyxDQUFDLEVBQUU7UUFDdkMsT0FBTyxjQUFjLENBQUMscUJBQXFCLEVBQUUsQ0FBQztLQUMvQztJQUVELE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQztBQUVELFNBQVMsbUJBQW1CLENBQzFCLFlBQTBCLEVBQzFCLG1CQUF3QztJQUV4QyxPQUFPLENBQUMsY0FBYyxFQUFFLEVBQUU7UUFDeEIsTUFBTSxjQUFjLEdBQUcsWUFBWSxDQUNqQyxjQUFjLEVBQ2QsWUFBWSxFQUNaLG1CQUFtQixDQUNwQixDQUFDO1FBRUYsSUFBSSxjQUFjLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDbEMsT0FBTyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDeEQ7UUFFRCxPQUFPLGNBQWMsQ0FBQztJQUN4QixDQUFDLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXJyb3JIYW5kbGVyLCBJbmplY3QsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QsIG1lcmdlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBkZW1hdGVyaWFsaXplLFxuICBleGhhdXN0TWFwLFxuICBmaWx0ZXIsXG4gIGdyb3VwQnksXG4gIG1hcCxcbiAgbWVyZ2VNYXAsXG4gIHRha2UsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtcbiAgcmVwb3J0SW52YWxpZEFjdGlvbnMsXG4gIEVmZmVjdE5vdGlmaWNhdGlvbixcbn0gZnJvbSAnLi9lZmZlY3Rfbm90aWZpY2F0aW9uJztcbmltcG9ydCB7IEVmZmVjdHNFcnJvckhhbmRsZXIgfSBmcm9tICcuL2VmZmVjdHNfZXJyb3JfaGFuZGxlcic7XG5pbXBvcnQgeyBtZXJnZUVmZmVjdHMgfSBmcm9tICcuL2VmZmVjdHNfcmVzb2x2ZXInO1xuaW1wb3J0IHtcbiAgb25JZGVudGlmeUVmZmVjdHNLZXksXG4gIG9uUnVuRWZmZWN0c0tleSxcbiAgT25SdW5FZmZlY3RzLFxuICBvbkluaXRFZmZlY3RzLFxuICBpc09uSWRlbnRpZnlFZmZlY3RzLFxuICBpc09uUnVuRWZmZWN0cyxcbiAgaXNPbkluaXRFZmZlY3RzLFxufSBmcm9tICcuL2xpZmVjeWNsZV9ob29rcyc7XG5pbXBvcnQgeyBFRkZFQ1RTX0VSUk9SX0hBTkRMRVIgfSBmcm9tICcuL3Rva2Vucyc7XG5pbXBvcnQgeyBnZXRTb3VyY2VGb3JJbnN0YW5jZSwgT2JzZXJ2YWJsZU5vdGlmaWNhdGlvbiB9IGZyb20gJy4vdXRpbHMnO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIEVmZmVjdFNvdXJjZXMgZXh0ZW5kcyBTdWJqZWN0PGFueT4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyLFxuICAgIEBJbmplY3QoRUZGRUNUU19FUlJPUl9IQU5ETEVSKVxuICAgIHByaXZhdGUgZWZmZWN0c0Vycm9ySGFuZGxlcjogRWZmZWN0c0Vycm9ySGFuZGxlclxuICApIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgYWRkRWZmZWN0cyhlZmZlY3RTb3VyY2VJbnN0YW5jZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy5uZXh0KGVmZmVjdFNvdXJjZUluc3RhbmNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHRvQWN0aW9ucygpOiBPYnNlcnZhYmxlPEFjdGlvbj4ge1xuICAgIHJldHVybiB0aGlzLnBpcGUoXG4gICAgICBncm91cEJ5KGdldFNvdXJjZUZvckluc3RhbmNlKSxcbiAgICAgIG1lcmdlTWFwKChzb3VyY2UkKSA9PiB7XG4gICAgICAgIHJldHVybiBzb3VyY2UkLnBpcGUoZ3JvdXBCeShlZmZlY3RzSW5zdGFuY2UpKTtcbiAgICAgIH0pLFxuICAgICAgbWVyZ2VNYXAoKHNvdXJjZSQpID0+IHtcbiAgICAgICAgY29uc3QgZWZmZWN0JCA9IHNvdXJjZSQucGlwZShcbiAgICAgICAgICBleGhhdXN0TWFwKChzb3VyY2VJbnN0YW5jZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVFZmZlY3RTb3VyY2UoXG4gICAgICAgICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyLFxuICAgICAgICAgICAgICB0aGlzLmVmZmVjdHNFcnJvckhhbmRsZXJcbiAgICAgICAgICAgICkoc291cmNlSW5zdGFuY2UpO1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIG1hcCgob3V0cHV0KSA9PiB7XG4gICAgICAgICAgICByZXBvcnRJbnZhbGlkQWN0aW9ucyhvdXRwdXQsIHRoaXMuZXJyb3JIYW5kbGVyKTtcbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQubm90aWZpY2F0aW9uO1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIGZpbHRlcihcbiAgICAgICAgICAgIChub3RpZmljYXRpb24pOiBub3RpZmljYXRpb24gaXMgT2JzZXJ2YWJsZU5vdGlmaWNhdGlvbjxBY3Rpb24+ID0+XG4gICAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5raW5kID09PSAnTicgJiYgbm90aWZpY2F0aW9uLnZhbHVlICE9IG51bGxcbiAgICAgICAgICApLFxuICAgICAgICAgIGRlbWF0ZXJpYWxpemUoKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIHN0YXJ0IHRoZSBzdHJlYW0gd2l0aCBhbiBJTklUIGFjdGlvblxuICAgICAgICAvLyBkbyB0aGlzIG9ubHkgZm9yIHRoZSBmaXJzdCBFZmZlY3QgaW5zdGFuY2VcbiAgICAgICAgY29uc3QgaW5pdCQgPSBzb3VyY2UkLnBpcGUoXG4gICAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgICBmaWx0ZXIoaXNPbkluaXRFZmZlY3RzKSxcbiAgICAgICAgICBtYXAoKGluc3RhbmNlKSA9PiBpbnN0YW5jZS5uZ3J4T25Jbml0RWZmZWN0cygpKVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBtZXJnZShlZmZlY3QkLCBpbml0JCk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZWZmZWN0c0luc3RhbmNlKHNvdXJjZUluc3RhbmNlOiBhbnkpIHtcbiAgaWYgKGlzT25JZGVudGlmeUVmZmVjdHMoc291cmNlSW5zdGFuY2UpKSB7XG4gICAgcmV0dXJuIHNvdXJjZUluc3RhbmNlLm5ncnhPbklkZW50aWZ5RWZmZWN0cygpO1xuICB9XG5cbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlRWZmZWN0U291cmNlKFxuICBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlcixcbiAgZWZmZWN0c0Vycm9ySGFuZGxlcjogRWZmZWN0c0Vycm9ySGFuZGxlclxuKTogKHNvdXJjZUluc3RhbmNlOiBhbnkpID0+IE9ic2VydmFibGU8RWZmZWN0Tm90aWZpY2F0aW9uPiB7XG4gIHJldHVybiAoc291cmNlSW5zdGFuY2UpID0+IHtcbiAgICBjb25zdCBtZXJnZWRFZmZlY3RzJCA9IG1lcmdlRWZmZWN0cyhcbiAgICAgIHNvdXJjZUluc3RhbmNlLFxuICAgICAgZXJyb3JIYW5kbGVyLFxuICAgICAgZWZmZWN0c0Vycm9ySGFuZGxlclxuICAgICk7XG5cbiAgICBpZiAoaXNPblJ1bkVmZmVjdHMoc291cmNlSW5zdGFuY2UpKSB7XG4gICAgICByZXR1cm4gc291cmNlSW5zdGFuY2UubmdyeE9uUnVuRWZmZWN0cyhtZXJnZWRFZmZlY3RzJCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lcmdlZEVmZmVjdHMkO1xuICB9O1xufVxuIl19