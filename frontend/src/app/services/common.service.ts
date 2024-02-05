import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor() {}

  parseJson(value: string) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return {};
    }
  }

  getFormatedQuery(queryValue: string) {
    const queryObj = this.parseJson(queryValue);
    const keys = Object.keys(queryObj) || null;
    let queryString = "";
    if (keys && keys.length > 0) {
      queryString = "?";
      keys.forEach((key, index) => {
        queryString += `${key}=${queryObj[key]}`;
        if (
          (keys.length === 2 && index === 0) ||
          (keys.length > 2 && index !== keys.length - 1)
        ) {
          queryString += "&";
        }
      });
    }
    return queryString;
  }
}
