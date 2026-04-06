import { UserValidator } from "@/models/validator/user";
import { generatePath, type EndpointPaths } from ".";
import { AuthValidator } from "@/models/validator/auth";
import z from "zod";
import { BaseValidator } from "@/models/validator/base";

export abstract class AuthEndpoints {
  static readonly PATHS = {
    POST: {
      "/auth/signup": generatePath(z.null(), { body: AuthValidator.BODY.signUp }),
      "/auth/signin": generatePath(UserValidator.MODEL.user, { body: AuthValidator.BODY.signIn }),
      "/auth/signout": generatePath(z.null()),
    },
    GET: {
      "/auth/signup/approval-status": generatePath(AuthValidator.RESPONSE.signUpApprovalStatus, {
        query: AuthValidator.QUERY.signUpApprovalStatus,
      }),
      "/auth/me": generatePath(UserValidator.MODEL.user),
    },
    PATCH: {
      "/auth/signup/approval": generatePath(UserValidator.MODEL.user, {
        body: AuthValidator.BODY.signUpApproval,
        header: BaseValidator.HEADERS.appSecret,
      }),
    },
  } satisfies EndpointPaths;
}
