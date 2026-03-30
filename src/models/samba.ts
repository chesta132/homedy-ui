import { type infer as ZodInfer } from "zod";
import type { SambaValidator } from "./validator/samba";

export type SambaBool = "yes" | "no";

export type Share = ZodInfer<typeof SambaValidator.MODEL.share>;
export type Shares = Record<string, ZodInfer<typeof SambaValidator.MODEL.share>>;

export type ShareMap = Record<string, string>;
