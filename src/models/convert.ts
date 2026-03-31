import type z from "zod";
import type { ConvertValidator } from "./validator/convert";

export namespace ConvertPayload {
  export type ConvertMultipleBody = z.infer<typeof ConvertValidator.BODY.convertMultiple>;
  export type ConvertOneBody = z.infer<typeof ConvertValidator.BODY.convertOne>;
}
