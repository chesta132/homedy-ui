import type { ErrorResponse, Pagination, Response } from "@/types/server";
import type { AxiosError, AxiosResponse } from "axios";

export class ServerError {
  // AxiosError<any> because response props replaced to non undefined
  readonly axios: AxiosError<any> & { response: { data: Response<ErrorResponse, false> } };
  readonly data: Response<ErrorResponse, false>["data"];
  readonly meta: Response<ErrorResponse, false>["meta"];

  constructor(error: AxiosError<Response<ErrorResponse, false>>) {
    if (!error.response?.data) {
      throw new Error("Invalid server error: missing response data");
    }
    this.axios = error as AxiosError<any> & { response: { data: Response<ErrorResponse, false> } };
    this.data = error.response.data.data;
    this.meta = error.response.data.meta;
  }

  getCode() {
    return this.data.code;
  }

  getMessage() {
    return this.data.message;
  }

  getField() {
    return this.data.field;
  }

  getDetails() {
    return this.data.details;
  }
}

export class ServerSuccess<T> {
  readonly data: T;
  readonly meta: Response<T>["meta"];
  readonly axios: AxiosResponse<Response<T>>;

  constructor(response: AxiosResponse<Response<T>>) {
    this.axios = response;
    this.data = response.data.data;
    this.meta = response.data.meta;
  }

  getInfo() {
    return this.meta.information;
  }

  getPagination(): Pagination {
    const meta = this.meta as Pagination;
    const current = meta.current;
    const hasNext = meta.hasNext;
    const next = meta.next;
    return { current, hasNext, next };
  }

  setToState(setState: React.Dispatch<React.SetStateAction<T>>) {
    setState(this.data);
  }
}
