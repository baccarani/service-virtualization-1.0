export interface Predicate {
  operator: string;
  data?: string;
  method: string;
  path: string;
  newPath?: string;
  newOperator?: string;
  query?: string;
  headers?: string;
  body?: string;
}
