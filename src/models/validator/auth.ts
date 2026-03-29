import z from "zod";
import { UserValidator } from "./user";

export abstract class AuthValidator {
  private static readonly TEMPLATE = {
    username: z.string().regex(UserValidator.REGEX.username, "Invalid username"),
    password: z.string().regex(UserValidator.REGEX.password, "Invalid password"),
  };

  static readonly BODY = {
    signIn: z.object({
      identifier: z.union([this.TEMPLATE.username, z.email()], "Invalid username or email"), // username or email
      password: this.TEMPLATE.password,
      rememberMe: z.boolean(),
    }),

    signUp: z.object({
      password: this.TEMPLATE.password,
      username: this.TEMPLATE.username,
      email: z.email("Invalid email format"),
    }),

    signUpApproval: z.object({
      identifier: z.string("Invalid identifier"), // token
      action: z.enum(["approve", "deny"]),
    }),
  };

  static readonly QUERY = {
    signUpApprovalStatus: z.object({
      email: z.email("Invalid email format"),
    }),
  };

  static readonly RESPONSE = {
    signUpApprovalStatus: z.object({
      email: z.email("Invalid email format"),
      username: this.TEMPLATE.username,
      status: z.enum(["pending", "approved", "denied"]),
    }),
  };
}
