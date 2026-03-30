import { BaseValidator } from "@/models/validator/base";
import { Endpoints, type EndpointPaths } from ".";
import { SambaValidator } from "@/models/validator/samba";
import z from "zod";

export abstract class SambaEndpoints {
  static readonly PATHS = {
    POST: {
      "/samba": Endpoints.generatePath(SambaValidator.RESPONSE.shares, { body: SambaValidator.BODY.createShare }),
      "/samba/backup": Endpoints.generatePath(z.null(), { header: BaseValidator.HEADERS.appSecret }),
      "/samba/restore": Endpoints.generatePath(SambaValidator.RESPONSE.shares, { header: BaseValidator.HEADERS.appSecret }),
    },
    GET: {
      "/samba": Endpoints.generatePath(SambaValidator.RESPONSE.shares),
      "/samba/{name}": Endpoints.generatePath(SambaValidator.RESPONSE.share, { param: SambaValidator.PARAM.shareName }),
      "/samba/config": Endpoints.generatePath(SambaValidator.RESPONSE.config, { header: BaseValidator.HEADERS.appSecret }),
    },
    PUT: {
      "/samba/{name}": Endpoints.generatePath(SambaValidator.RESPONSE.shares, {
        body: SambaValidator.BODY.updateShare,
        param: SambaValidator.PARAM.shareName,
      }),
      "/samba/config": Endpoints.generatePath(SambaValidator.RESPONSE.config, {
        body: SambaValidator.BODY.updateConfig,
        header: BaseValidator.HEADERS.appSecret,
      }),
    },
    DELETE: {
      "/samba/{name}": Endpoints.generatePath(SambaValidator.RESPONSE.shares, { param: SambaValidator.PARAM.shareName }),
    },
  } satisfies EndpointPaths;
}
