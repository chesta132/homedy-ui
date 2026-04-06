import { UserValidator } from "@/models/validator/user";
import { Endpoints, type EndpointPaths } from ".";

export abstract class UserEndpoints {
  static readonly PATHS = {
    GET: {
      "/users/{id}": Endpoints.generatePath(UserValidator.RESPONSE.getUser, { param: UserValidator.PARAM.userId }),
    },
  } satisfies EndpointPaths;
}
