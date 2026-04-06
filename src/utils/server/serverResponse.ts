import type { ErrorResponse, Pagination, Response } from "@/types/server";
import type { AxiosError, AxiosResponse } from "axios";
import { capital } from "../manipulate/string";
import type { ZodType } from "zod";

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

  getMessage({ skipCapital = false } = {}) {
    if (skipCapital) return this.data.message;
    else return capital(this.data.message);
  }

  getFields() {
    return this.data.fields;
  }

  getDetails() {
    return this.data.details;
  }
}

export class ServerSuccess<T> {
  readonly data: T;
  readonly meta: Response<T>["meta"];
  readonly axios: AxiosResponse<Response<T>>;

  constructor(response: AxiosResponse<Response<T>>, validator: ZodType) {
    this.axios = response;
    const data = response.data;
    if (data instanceof Blob || typeof data !== "object") {
      this.data = validator.parse(data) as any;
      this.meta = { status: "SUCCESS", timestamp: new Date() };
    } else {
      this.data = validator.parse(data.data) as any;
      this.meta = data.meta;
    }
  }

  getInfo() {
    return this.meta.information;
  }

  getPagination(): Pagination {
    return this.meta.pagination || { current: 0, hasNext: false, next: 0 };
  }

  getFilename: T extends Blob ? () => string : never = (() => {
    const disposition: string = this.axios.headers["content-disposition"] ?? "";
    const match = disposition.match(/filename="?([^";\r\n]+)"?/);
    return match?.[1]?.trim();
  }) as any;

  setToState(setState: React.Dispatch<React.SetStateAction<T>>) {
    setState(this.data);
  }
}
