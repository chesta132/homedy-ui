import { isProdEnv, VITE_BACKEND_URL } from "@/config";
import { pick } from "../manipulate/object";
import type { EndpointsType } from "./endpoints";
import axios, { isAxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { ServerError, ServerSuccess } from "./serverResponse";
import type { Response } from "@/types/server";
import { camelizeKeys, decamelizeKeys } from "humps";

type OptionalField<K extends string, V> = [undefined] extends [V] ? Partial<Record<K, V>> : Record<K, V>;
type Get = EndpointsType["GET"];
type Put = EndpointsType["PUT"];
type Post = EndpointsType["POST"];
type Delete = EndpointsType["DELETE"];
type Patch = EndpointsType["PATCH"];

export type ApiConfig<B, Q, P> = AxiosRequestConfig & OptionalField<"data", B> & OptionalField<"query", Q> & OptionalField<"param", P>;

export class ApiClient {
  private readonly api;

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      withCredentials: true,
    });

    this.api.interceptors.request.use((req) => {
      if (req.data) {
        req.data = decamelizeKeys(req.data);
      }
      return req;
    });

    this.api.interceptors.response.use(
      (response) => {
        response.data = camelizeKeys(response.data) as any;
        return response;
      },
      (error) => {
        if (isProdEnv()) console.error("Error in API call:\n", error);
        else console.error("Server request failed.\n", { ...pick(error, ["code", "message", "status"]), ...error?.response?.data?.data });
        if (error.response?.data?.code === "CLIENT_REFRESH") {
          location.reload();
          return;
        }
        return Promise.reject(error);
      },
    );
  }

  private async request<T>(config: ApiConfig<any, any, any>): Promise<ServerSuccess<T>> {
    try {
      const response = (await this.api.request<T>({
        ...config,
      })) as AxiosResponse<Response<T>>;
      return new ServerSuccess(response);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new ServerError(error);
      }
      throw error;
    }
  }

  get<P extends keyof Get>(path: P, config?: ApiConfig<Get[P]["body"], Get[P]["query"], Get[P]["param"]>) {
    return this.request<Get[P]["response"]>({ ...config, url: path as string, method: "GET" });
  }

  post<P extends keyof Post>(path: P, config?: ApiConfig<Post[P]["body"], Post[P]["query"], Post[P]["param"]>) {
    return this.request<Post[P]["response"]>({ ...config, url: path as string, method: "POST" });
  }

  put<P extends keyof Put>(path: P, config?: ApiConfig<Put[P]["body"], Put[P]["query"], Put[P]["param"]>) {
    return this.request<Put[P]["response"]>({ ...config, url: path as string, method: "PUT" });
  }

  patch<P extends keyof Patch>(path: P, config?: ApiConfig<Patch[P]["body"], Patch[P]["query"], Patch[P]["param"]>) {
    return this.request<Patch[P]["response"]>({ ...config, url: path as string, method: "PATCH" });
  }

  delete<P extends keyof Delete>(path: P, config?: ApiConfig<Delete[P]["body"], Delete[P]["query"], Delete[P]["param"]>) {
    return this.request<Delete[P]["response"]>({ ...config, url: path as string, method: "DELETE" });
  }
}

export const api = new ApiClient(VITE_BACKEND_URL!);
