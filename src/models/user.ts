import { type infer as ZodInfer } from "zod";
import type { UserValidator } from "./validator/user";

export type User = ZodInfer<typeof UserValidator.MODEL.user>;
export type Profile = ZodInfer<typeof UserValidator.MODEL.profile>;
