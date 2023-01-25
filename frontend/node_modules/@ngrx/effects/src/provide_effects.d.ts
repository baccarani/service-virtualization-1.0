import { Type } from '@angular/core';
import { EnvironmentProviders } from '@ngrx/store';
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
export declare function provideEffects(effects: Type<unknown>[]): EnvironmentProviders;
