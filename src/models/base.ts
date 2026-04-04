import type z from "zod";
import type { BaseValidator } from "./validator/base";

export type Sort = z.infer<typeof BaseValidator.TEMPLATE.sort>;
