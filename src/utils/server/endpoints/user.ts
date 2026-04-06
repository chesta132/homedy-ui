import { UserValidator } from "@/models/validator/user";
import { generatePath, type EndpointPaths } from ".";

export abstract class UserEndpoints {
  static readonly PATHS = {
    GET: {
      "/users/{id}": generatePath(UserValidator.RESPONSE.getUser, { param: UserValidator.PARAM.userId }),
    },
  } satisfies EndpointPaths;
}
