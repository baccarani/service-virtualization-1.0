import { ENVIRONMENT_INITIALIZER, inject, InjectFlags, } from '@angular/core';
import { FEATURE_STATE_PROVIDER, ROOT_STORE_PROVIDER, Store, } from '@ngrx/store';
import { EffectsRunner } from './effects_runner';
import { EffectSources } from './effect_sources';
import { rootEffectsInit as effectsInit } from './effects_actions';
/**
 * Runs the provided effects.
 * Can be called at the root and feature levels.
 *
 * @usageNotes
 *
 * ### Providing effects at the root level
 *
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideEffects([RouterEffects])],
 * });
 * ```
 *
 * ### Providing effects at the feature level
 *
 * ```ts
 * const booksRoutes: Route[] = [
 *   {
 *     path: '',
 *     providers: [provideEffects([BooksApiEffects])],
 *     children: [
 *       { path: '', component: BookListComponent },
 *       { path: ':id', component: BookDetailsComponent },
 *     ],
 *   },
 * ];
 * ```
 */
export function provideEffects(effects) {
    return {
        ɵproviders: [
            effects,
            {
                provide: ENVIRONMENT_INITIALIZER,
                multi: true,
                useValue: () => {
                    inject(ROOT_STORE_PROVIDER);
                    inject(FEATURE_STATE_PROVIDER, InjectFlags.Optional);
                    const effectsRunner = inject(EffectsRunner);
                    const effectSources = inject(EffectSources);
                    const shouldInitEffects = !effectsRunner.isStarted;
                    if (shouldInitEffects) {
                        effectsRunner.start();
                    }
                    for (const effectsClass of effects) {
                        const effectsInstance = inject(effectsClass);
                        effectSources.addEffects(effectsInstance);
                    }
                    if (shouldInitEffects) {
                        const store = inject(Store);
                        store.dispatch(effectsInit());
                    }
                },
            },
        ],
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZV9lZmZlY3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9lZmZlY3RzL3NyYy9wcm92aWRlX2VmZmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixNQUFNLEVBQ04sV0FBVyxHQUVaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFFTCxzQkFBc0IsRUFDdEIsbUJBQW1CLEVBQ25CLEtBQUssR0FDTixNQUFNLGFBQWEsQ0FBQztBQUNyQixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDakQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxlQUFlLElBQUksV0FBVyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFbkU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0Qkc7QUFDSCxNQUFNLFVBQVUsY0FBYyxDQUFDLE9BQXdCO0lBQ3JELE9BQU87UUFDTCxVQUFVLEVBQUU7WUFDVixPQUFPO1lBQ1A7Z0JBQ0UsT0FBTyxFQUFFLHVCQUF1QjtnQkFDaEMsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsUUFBUSxFQUFFLEdBQUcsRUFBRTtvQkFDYixNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQztvQkFDNUIsTUFBTSxDQUFDLHNCQUFzQixFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFFckQsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUM1QyxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQzVDLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDO29CQUVuRCxJQUFJLGlCQUFpQixFQUFFO3dCQUNyQixhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7cUJBQ3ZCO29CQUVELEtBQUssTUFBTSxZQUFZLElBQUksT0FBTyxFQUFFO3dCQUNsQyxNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7d0JBQzdDLGFBQWEsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUM7cUJBQzNDO29CQUVELElBQUksaUJBQWlCLEVBQUU7d0JBQ3JCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDNUIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO3FCQUMvQjtnQkFDSCxDQUFDO2FBQ0Y7U0FDRjtLQUNGLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRU5WSVJPTk1FTlRfSU5JVElBTElaRVIsXG4gIGluamVjdCxcbiAgSW5qZWN0RmxhZ3MsXG4gIFR5cGUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgRW52aXJvbm1lbnRQcm92aWRlcnMsXG4gIEZFQVRVUkVfU1RBVEVfUFJPVklERVIsXG4gIFJPT1RfU1RPUkVfUFJPVklERVIsXG4gIFN0b3JlLFxufSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBFZmZlY3RzUnVubmVyIH0gZnJvbSAnLi9lZmZlY3RzX3J1bm5lcic7XG5pbXBvcnQgeyBFZmZlY3RTb3VyY2VzIH0gZnJvbSAnLi9lZmZlY3Rfc291cmNlcyc7XG5pbXBvcnQgeyByb290RWZmZWN0c0luaXQgYXMgZWZmZWN0c0luaXQgfSBmcm9tICcuL2VmZmVjdHNfYWN0aW9ucyc7XG5cbi8qKlxuICogUnVucyB0aGUgcHJvdmlkZWQgZWZmZWN0cy5cbiAqIENhbiBiZSBjYWxsZWQgYXQgdGhlIHJvb3QgYW5kIGZlYXR1cmUgbGV2ZWxzLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFByb3ZpZGluZyBlZmZlY3RzIGF0IHRoZSByb290IGxldmVsXG4gKlxuICogYGBgdHNcbiAqIGJvb3RzdHJhcEFwcGxpY2F0aW9uKEFwcENvbXBvbmVudCwge1xuICogICBwcm92aWRlcnM6IFtwcm92aWRlRWZmZWN0cyhbUm91dGVyRWZmZWN0c10pXSxcbiAqIH0pO1xuICogYGBgXG4gKlxuICogIyMjIFByb3ZpZGluZyBlZmZlY3RzIGF0IHRoZSBmZWF0dXJlIGxldmVsXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGJvb2tzUm91dGVzOiBSb3V0ZVtdID0gW1xuICogICB7XG4gKiAgICAgcGF0aDogJycsXG4gKiAgICAgcHJvdmlkZXJzOiBbcHJvdmlkZUVmZmVjdHMoW0Jvb2tzQXBpRWZmZWN0c10pXSxcbiAqICAgICBjaGlsZHJlbjogW1xuICogICAgICAgeyBwYXRoOiAnJywgY29tcG9uZW50OiBCb29rTGlzdENvbXBvbmVudCB9LFxuICogICAgICAgeyBwYXRoOiAnOmlkJywgY29tcG9uZW50OiBCb29rRGV0YWlsc0NvbXBvbmVudCB9LFxuICogICAgIF0sXG4gKiAgIH0sXG4gKiBdO1xuICogYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlRWZmZWN0cyhlZmZlY3RzOiBUeXBlPHVua25vd24+W10pOiBFbnZpcm9ubWVudFByb3ZpZGVycyB7XG4gIHJldHVybiB7XG4gICAgybVwcm92aWRlcnM6IFtcbiAgICAgIGVmZmVjdHMsXG4gICAgICB7XG4gICAgICAgIHByb3ZpZGU6IEVOVklST05NRU5UX0lOSVRJQUxJWkVSLFxuICAgICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgICAgdXNlVmFsdWU6ICgpID0+IHtcbiAgICAgICAgICBpbmplY3QoUk9PVF9TVE9SRV9QUk9WSURFUik7XG4gICAgICAgICAgaW5qZWN0KEZFQVRVUkVfU1RBVEVfUFJPVklERVIsIEluamVjdEZsYWdzLk9wdGlvbmFsKTtcblxuICAgICAgICAgIGNvbnN0IGVmZmVjdHNSdW5uZXIgPSBpbmplY3QoRWZmZWN0c1J1bm5lcik7XG4gICAgICAgICAgY29uc3QgZWZmZWN0U291cmNlcyA9IGluamVjdChFZmZlY3RTb3VyY2VzKTtcbiAgICAgICAgICBjb25zdCBzaG91bGRJbml0RWZmZWN0cyA9ICFlZmZlY3RzUnVubmVyLmlzU3RhcnRlZDtcblxuICAgICAgICAgIGlmIChzaG91bGRJbml0RWZmZWN0cykge1xuICAgICAgICAgICAgZWZmZWN0c1J1bm5lci5zdGFydCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAoY29uc3QgZWZmZWN0c0NsYXNzIG9mIGVmZmVjdHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGVmZmVjdHNJbnN0YW5jZSA9IGluamVjdChlZmZlY3RzQ2xhc3MpO1xuICAgICAgICAgICAgZWZmZWN0U291cmNlcy5hZGRFZmZlY3RzKGVmZmVjdHNJbnN0YW5jZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHNob3VsZEluaXRFZmZlY3RzKSB7XG4gICAgICAgICAgICBjb25zdCBzdG9yZSA9IGluamVjdChTdG9yZSk7XG4gICAgICAgICAgICBzdG9yZS5kaXNwYXRjaChlZmZlY3RzSW5pdCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF0sXG4gIH07XG59XG4iXX0=