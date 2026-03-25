/**
 * Structure of an error response payload.
 */
export interface ErrorResponse {
  /** Unique error code */
  code: CodeError;
  /** Human-readable message */
  message: string;
  /** Extra details for debugging */
  details?: string;
  /** Optional field reference (useful for forms) */
  field?: Record<string, string>;
}

export interface Pagination {
  /** Indicates current offset */
  current: number;
  /** Indicates whether there is next data (for pagination) */
  hasNext: boolean;
  /** Next offset for pagination */
  next: number;
}

/**
 * Standard response envelope.
 */
export interface Response<T, Success extends boolean = boolean> {
  meta: {
    /** Status of response (SUCCESS/ERROR) */
    status: Success extends true ? "SUCCESS" : "ERROR";
    /** Response timestamp */
    timestamp: Date;
    /** Optional information message */
    information?: string;
    debug?: any;
  } & (Success extends true ? Pagination : object);
  /** Response payload data */
  data: T;
}

/**
 * HTTP Not Found error code.
 */
export const codeErrorNotFound: CodeNotFoundError[] = ["NOT_FOUND"];

/**
 * Server-side related error codes.
 */
export const codeErrorServer: CodeServerError[] = ["SERVER_ERROR", "BAD_GATEWAY", "SERVICE_UNAVAILABLE", "NOT_IMPLEMENTED", "GATEWAY_TIMEOUT"];

/**
 * Client-side related error codes.
 */
export const codeErrorClient: CodeClientError[] = [
  "BAD_REQUEST",
  "UNAUTHORIZED",
  "CONFLICT",
  "FORBIDDEN",
  "UNPROCESSABLE_ENTITY",
  "TOO_MANY_REQUESTS",
  "METHOD_NOT_ALLOWED",
  "NOT_ACCEPTABLE",
  "REQUEST_TIMEOUT",
  "PAYLOAD_TOO_LARGE",
  "UNSUPPORTED_MEDIA_TYPE",
  "GONE",
];

/**
 * All possible error code values.
 */
export const CodeErrorValues: CodeError[] = [...codeErrorNotFound, ...codeErrorServer, ...codeErrorClient];

export type CodeNotFoundError = "NOT_FOUND";

export type CodeServerError = "SERVER_ERROR" | "BAD_GATEWAY" | "SERVICE_UNAVAILABLE" | "NOT_IMPLEMENTED" | "GATEWAY_TIMEOUT";

export type CodeClientError =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "CONFLICT"
  | "FORBIDDEN"
  | "UNPROCESSABLE_ENTITY"
  | "TOO_MANY_REQUESTS"
  | "METHOD_NOT_ALLOWED"
  | "NOT_ACCEPTABLE"
  | "REQUEST_TIMEOUT"
  | "PAYLOAD_TOO_LARGE"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "GONE";

export type CodeError = CodeNotFoundError | CodeServerError | CodeClientError;

export type StateErrorServer = Omit<ErrorResponse, "field">;
