import z from "zod";

export abstract class SambaValidator {
  static readonly RESERVED_SHARE_NAMES = ["global", "printers", "print$", "config", "backup", "restore"];

  private static readonly TEMPLATE = {
    shareName: z.string().refine((name) => !this.RESERVED_SHARE_NAMES.includes(name), "Reserved share name"),
    sambaBool: z.enum(["yes", "no"]),
    absPath: z.string().regex(/^(\/[^/ ]*)+\/?$/, "Invalid absolute path"),
  };

  static readonly MODEL = {
    share: z.object({
      path: this.TEMPLATE.absPath,
      readOnly: this.TEMPLATE.sambaBool,
      browsable: this.TEMPLATE.sambaBool,
      validUsers: z.array(z.string().min(1)).min(1, "At least 1 valid user required"),
      adminUsers: z.array(z.string().min(1)).min(1, "At least 1 admin user required"),
      permissions: z.array(z.number().int().min(0).max(7)).length(3, "Permissions must have exactly 3 values"),
    }),
  };

  static readonly BODY = {
    createShare: z.object({ name: this.TEMPLATE.shareName }).and(this.MODEL.share),

    updateShare: z.object({ name: this.TEMPLATE.shareName }).and(this.MODEL.share),

    deleteShare: z.object({
      name: this.TEMPLATE.shareName,
    }),

    updateConfig: z.record(z.string(), z.string()),
  };

  static readonly RESPONSE = {
    share: this.MODEL.share,
    shares: z.record(this.TEMPLATE.shareName, this.MODEL.share),
    config: z.record(z.string(), z.string()),
  };
}
