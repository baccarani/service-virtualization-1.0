import { EffectMetadata, EffectsMetadata } from './models';
export declare function getEffectsMetadata<T extends Object>(instance: T): EffectsMetadata<T>;
export declare function getSourceMetadata<T extends Object>(instance: T): EffectMetadata<T>[];
