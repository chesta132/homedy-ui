import type { infer as ZodInfer } from "zod";
import type { AuthValidator } from "./validator/auth";

export namespace AuthResponse {
  export type ApprovalStatus = ZodInfer<typeof AuthValidator.RESPONSE.signUpApprovalStatus>;
}
