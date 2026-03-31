import { Endpoints, type EndpointPaths } from ".";
import z from "zod";
import { ConvertValidator } from "@/models/validator/convert";

export abstract class ConvertEndpoints {
  static readonly TEMPLATES = {};
  static readonly PATHS = {
    POST: {
      "/convert/multiple": Endpoints.generatePath(z.instanceof(Blob), { body: ConvertValidator.BODY.convertMultiple }),
      "/convert/single": Endpoints.generatePath(z.instanceof(Blob), { body: ConvertValidator.BODY.convertOne }),
    },
  } satisfies EndpointPaths;
}
