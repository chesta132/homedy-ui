import { isProdEnv, VITE_BACKEND_URL } from "@/config";
import { pick } from "../manipulate/object";
import { Endpoints, type EndpointPath, type EndpointsType, type Method } from "./endpoints";
import axios, { isAxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { ServerError, ServerSuccess } from "./serverResponse";
import type { Response } from "@/types/server";

type OptionalField<K extends string, V> = [undefined] extends [V]
  ? Partial<Record<K, V>>
  : [Partial<V>] extends [V]
    ? Partial<Record<K, V>>
    : Record<K, V>;
type Get = EndpointsType["GET"];
type Put = EndpointsType["PUT"];
type Post = EndpointsType["POST"];
type Delete = EndpointsType["DELETE"];
type Patch = EndpointsType["PATCH"];

export type ApiConfig<B = any, Q = any, P = any, H = any> = AxiosRequestConfig &
  OptionalField<"data", B> &
  OptionalField<"query", Q> &
  OptionalField<"param", P> &
  OptionalField<"header", H> & { method: Method; url: keyof MergeUnion<EndpointsType[Method]> };

/** Omit for ConfigWrapper */
type OCW<T> = Omit<T, "path" | "method" | "url">;
type ConfigWrapper<T> = [Partial<OCW<T>>] extends [OCW<T>] ? [OCW<T>?] : [OCW<T>];

export class ApiClient {
  private readonly api;

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      withCredentials: true,
    });

    this.api.interceptors.response.use(undefined, (error) => {
      if (isProdEnv()) console.error("Error in API call:\n", error);
      else console.error("Server request failed.\n", { ...pick(error, ["code", "message", "status"]), ...error?.response?.data?.data });
      if (error.response?.data?.code === "CLIENT_REFRESH") {
        location.reload();
        return;
      }
      return Promise.reject(error);
    });
  }

  private async request<T>({ query, param, url, header, method, data, ...config }: ApiConfig): Promise<ServerSuccess<T>> {
    try {
      const validator = Endpoints.PATHS[method][url as keyof (typeof Endpoints.PATHS)[Method]] as EndpointPath;
      const validated = {
        body: validator.body.parse(data),
        param: validator.param.parse(param) ?? {},
        query: validator.query.parse(query) ?? {},
        header: validator.header.parse(header) ?? {},
      };
      const path = joinQuery(insertParam(url, validated.param), validated.query);
      const response = (await this.api.request<T>({
        ...config,
        url: path,
        method,
        data: validated.body,
        headers: { ...config.headers, ...(validated.header as any) },
      })) as AxiosResponse<Response<T>>;
      return new ServerSuccess(response, validator.response);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new ServerError(error);
      }
      throw error;
    }
  }

  get<P extends keyof Get>(path: P, ...[config]: ConfigWrapper<ApiConfig<Get[P]["body"], Get[P]["query"], Get[P]["param"], Get[P]["header"]>>) {
    return this.request<Get[P]["response"]>({ ...config, url: path, method: "GET" });
  }

  post<P extends keyof Post>(path: P, ...[config]: ConfigWrapper<ApiConfig<Post[P]["body"], Post[P]["query"], Post[P]["param"], Post[P]["header"]>>) {
    return this.request<Post[P]["response"]>({ ...config, url: path, method: "POST" });
  }

  put<P extends keyof Put>(path: P, ...[config]: ConfigWrapper<ApiConfig<Put[P]["body"], Put[P]["query"], Put[P]["param"], Put[P]["header"]>>) {
    return this.request<Put[P]["response"]>({ ...config, url: path, method: "PUT" });
  }

  patch<P extends keyof Patch>(
    path: P,
    ...[config]: ConfigWrapper<ApiConfig<Patch[P]["body"], Patch[P]["query"], Patch[P]["param"], Patch[P]["header"]>>
  ) {
    return this.request<Patch[P]["response"]>({ ...config, url: path, method: "PATCH" });
  }

  delete<P extends keyof Delete>(
    path: P,
    ...[config]: ConfigWrapper<ApiConfig<Delete[P]["body"], Delete[P]["query"], Delete[P]["param"], Delete[P]["header"]>>
  ) {
    return this.request<Delete[P]["response"]>({ ...config, url: path, method: "DELETE" });
  }
}

export const api = new ApiClient(VITE_BACKEND_URL!);

function joinQuery(path: string, queries: Record<string, any>) {
  const searchParams = new URLSearchParams(queries);
  return `${path}?${searchParams.toString()}`;
}

function insertParam(path: string, params: Record<string, any>) {
  return path.replace(/\{(\w+)\}/g, (_, key) => {
    if (!(key in params)) throw new Error(`Missing param: ${key} while insert param for ${path}`);
    return String(params[key]);
  });
}
