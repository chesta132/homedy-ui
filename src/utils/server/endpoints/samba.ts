import { BaseValidator } from "@/models/validator/base";
import { generatePath, type EndpointPaths } from ".";
import { SambaValidator } from "@/models/validator/samba";
import z from "zod";

export abstract class SambaEndpoints {
  static readonly PATHS = {
    POST: {
      "/samba": generatePath(SambaValidator.RESPONSE.shares, { body: SambaValidator.BODY.createShare }),
      "/samba/backup": generatePath(z.null(), { header: BaseValidator.HEADERS.appSecret }),
      "/samba/restore": generatePath(SambaValidator.RESPONSE.shares, { header: BaseValidator.HEADERS.appSecret }),
    },
    GET: {
      "/samba": generatePath(SambaValidator.RESPONSE.shares),
      "/samba/{name}": generatePath(SambaValidator.RESPONSE.share, { param: SambaValidator.PARAM.shareName }),
      "/samba/config": generatePath(SambaValidator.RESPONSE.config, { header: BaseValidator.HEADERS.appSecret }),
    },
    PUT: {
      "/samba/{name}": generatePath(SambaValidator.RESPONSE.shares, {
        body: SambaValidator.BODY.updateShare,
        param: SambaValidator.PARAM.shareName,
      }),
      "/samba/config": generatePath(SambaValidator.RESPONSE.config, {
        body: SambaValidator.BODY.updateConfig,
        header: BaseValidator.HEADERS.appSecret,
      }),
    },
    DELETE: {
      "/samba/{name}": generatePath(SambaValidator.RESPONSE.shares, { param: SambaValidator.PARAM.shareName }),
    },
  } satisfies EndpointPaths;
}
