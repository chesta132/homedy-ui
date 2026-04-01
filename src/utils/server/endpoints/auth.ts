import { UserValidator } from "@/models/validator/user";
import { Endpoints, type EndpointPaths } from ".";
import { AuthValidator } from "@/models/validator/auth";
import z from "zod";
import { BaseValidator } from "@/models/validator/base";

export abstract class AuthEndpoints {
  static readonly PATHS = {
    POST: {
      "/auth/signup": Endpoints.generatePath(z.null(), { body: AuthValidator.BODY.signUp }),
      "/auth/signin": Endpoints.generatePath(UserValidator.MODEL.user, { body: AuthValidator.BODY.signIn }),
      "/auth/signout": Endpoints.generatePath(z.null()),
    },
    GET: {
      "/auth/signup/approval-status": Endpoints.generatePath(AuthValidator.RESPONSE.signUpApprovalStatus, {
        query: AuthValidator.QUERY.signUpApprovalStatus,
      }),
      "/auth/me": Endpoints.generatePath(UserValidator.MODEL.user),
    },
    PATCH: {
      "/auth/signup/approval": Endpoints.generatePath(UserValidator.MODEL.user, {
        body: AuthValidator.BODY.signUpApproval,
        header: BaseValidator.HEADERS.appSecret,
      }),
    },
  } satisfies EndpointPaths;
}
