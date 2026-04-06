import z from "zod";
import { UserValidator } from "./user";

export abstract class AuthValidator {
  private static readonly TEMPLATE = {
    username: z.string().regex(UserValidator.REGEX.username, "Invalid username").min(1, "Username is required"),
    password: z.string().regex(UserValidator.REGEX.password, "Invalid password").min(1, "Password is required"),
    email: z.email("Invalid email format").min(1, "Email is required"),
  };

  static readonly BODY = {
    signIn: z.object({
      identifier: z.union([this.TEMPLATE.username, z.email().min(1)], "Invalid username or email"), // username or email
      password: this.TEMPLATE.password,
      rememberMe: z.boolean(),
    }),

    signUp: z.object({
      password: this.TEMPLATE.password,
      username: this.TEMPLATE.username,
      email: this.TEMPLATE.email,
    }),

    signUpApproval: z.object({
      identifier: z.string("Invalid identifier").min(1, "Username/email is required"), // token
      action: z.enum(["approve", "deny"]),
    }),
  };

  static readonly QUERY = {
    signUpApprovalStatus: z.object({
      email: this.TEMPLATE.email,
    }),
  };

  static readonly RESPONSE = {
    signUpApprovalStatus: z.object({
      email: this.TEMPLATE.email,
      username: this.TEMPLATE.username,
      status: z.enum(["pending", "approved", "denied"]),
    }),
  };
}
