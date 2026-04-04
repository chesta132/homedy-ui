import z, { ZodOptional, ZodType, type ZodObject, type infer as ZodInfer } from "zod";
import { AuthEndpoints } from "./auth";
import { deepMergeAll } from "@/utils/manipulate/object";
import { SambaEndpoints } from "./samba";
import { ConvertEndpoints } from "./convert";
import { NoteEndpoints } from "./note";

export type Method = "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
export type Response = ZodType;
export type Body = ZodType;
export type Query = ZodOptional<ZodObject> | ZodObject;
export type Param = ZodOptional<ZodObject> | ZodObject;
export type Header = ZodOptional<ZodObject> | ZodObject;

export type EndpointPath = {
  response: Response;
  body: Body;
  query: Query;
  param: Param;
  header: Header;
};

export type EndpointPaths = Partial<Record<Method, Record<string, EndpointPath>>>;

export abstract class Endpoints {
  private static readonly DEFAULT_PATH = { DELETE: {}, GET: {}, PATCH: {}, POST: {}, PUT: {} } as EndpointPaths;
  static readonly PATHS = deepMergeAll(
    this.DEFAULT_PATH,
    AuthEndpoints.PATHS,
    SambaEndpoints.PATHS,
    ConvertEndpoints.PATHS,
    NoteEndpoints.PATHS,
  ) satisfies EndpointPaths;

  static generatePath<B extends Body, R extends Response, Q extends Query, P extends Param, H extends Header>(
    response: R,
    {
      body = z.undefined() as unknown as B,
      param = z.object().optional() as P,
      query = z.object().optional() as Q,
      header = z.object().optional() as H,
    } = {},
  ) {
    return { body, response, query, param, header };
  }
}

export type InferEndpointPath<T extends EndpointPath> = {
  response: ZodInfer<T["response"]>;
  body: ZodInfer<T["body"]>;
  query: ZodInfer<T["query"]>;
  param: ZodInfer<T["param"]>;
  header: ZodInfer<T["header"]>;
};

export type InferEndpointPaths<T extends EndpointPaths> = {
  [M in keyof T]: {
    [P in keyof T[M]]: T[M][P] extends EndpointPath ? InferEndpointPath<T[M][P]> : never;
  };
};

export type EndpointsType = InferEndpointPaths<typeof Endpoints.PATHS>;
