import z, { ZodOptional, ZodType, type ZodObject } from "zod";
import { AuthEndpoints } from "./auth";
import { deepMergeAll } from "@/utils/manipulate/object";

export type Method = "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
export type Response = ZodType;
export type Body = ZodType;
export type Query = ZodOptional<ZodObject> | ZodObject;
export type Param = ZodOptional<ZodObject> | ZodObject;

export type EndpointPath = {
  response: Response;
  body: Body;
  query: Query;
  param: Param;
};

export type EndpointPaths = Partial<Record<Method, Record<string, EndpointPath>>>;

export abstract class Endpoints {
  static readonly PATHS = deepMergeAll(AuthEndpoints.PATHS) satisfies EndpointPaths;

  static generatePath<B extends Body, R extends Response, Q extends Query, P extends Param>(
    response: R,
    { body = z.undefined() as unknown as B, param = z.object().optional() as P, query = z.object().optional() as Q } = {},
  ) {
    return { body, response, query, param };
  }
}
