import z from "zod";
import { BaseValidator } from "./base";

export abstract class UserValidator {
  static readonly regex = {
    /**
     * length = 3-30
     * allowed char = a-z A-Z 0-9 _ .
     * start/end = a-z A-Z 0-9 _
     * must have = non-number character
     */
    username: /^(?![\d]+$)[a-zA-Z0-9_]([a-zA-Z0-9_.]{1,28}[a-zA-Z0-9_]|[a-zA-Z0-9_]?)$/,
    /**
     * length = 8-32
     * must have = 1 lower, 1 upper, 1 number
     */
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,32}$/,
  };

  static readonly user = z
    .object({
      username: z.string().regex(this.regex.username, "Invalid username"),
      email: z.email("Invalid email format"),
      status: z.enum(["active", "pending"], "Invalid status"),
    })
    .and(BaseValidator.baseRecyclable);

  static readonly signIn = z.object({
    identifier: z.string("Invalid identifier"), // username or email
    password: z.string().regex(this.regex.password, "Invalid password"),
    rememberMe: z.boolean(),
  });

  static readonly signUp = z.object({
    password: z.string().regex(this.regex.password, "Invalid password"),
    username: z.string().regex(this.regex.username, "Invalid username"),
    email: z.email("Invalid email format"),
  });

  static readonly signUpApproval = z.object({
    identifier: z.string("Invalid identifier"), // token
    action: z.enum(["approve", "deny"]),
  });

  static readonly signUpApprovalStatus = z.object({
    email: z.email("Invalid email format"),
  });
}
