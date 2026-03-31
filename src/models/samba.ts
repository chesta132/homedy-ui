import { type infer as ZodInfer } from "zod";
import type { SambaValidator } from "./validator/samba";

export type SambaBool = "yes" | "no";

export type Share = ZodInfer<typeof SambaValidator.MODEL.share>;
export type Shares = Record<string, ZodInfer<typeof SambaValidator.MODEL.share>>;

export type ShareMap = Record<string, string>;

export namespace SharePayload {
  export type CreateShareBody = ZodInfer<typeof SambaValidator.BODY.createShare>;
  export type UpdateShareBody = ZodInfer<typeof SambaValidator.BODY.updateShare>;
}
