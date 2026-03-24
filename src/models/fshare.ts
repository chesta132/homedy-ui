import { type infer as ZodInfer } from "zod";
import type { ShareValidator } from "./validator/fshare";

export type Share = ZodInfer<typeof ShareValidator.share>;
export type Shares = Record<string, ZodInfer<typeof ShareValidator.share>>;
