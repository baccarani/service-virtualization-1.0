export declare function getSourceForInstance<T>(instance: T): T;
export interface NextNotification<T> {
    kind: 'N';
    value: T;
}
export interface ErrorNotification {
    kind: 'E';
    error: any;
}
export interface CompleteNotification {
    kind: 'C';
}
export declare type ObservableNotification<T> = NextNotification<T> | ErrorNotification | CompleteNotification;
