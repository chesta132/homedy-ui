import z from "zod";

export abstract class ShareValidator {
  static readonly regex = {
    /**
     * must start with /
     * no spaces allowed
     */
    absPath: /^(\/[^/ ]*)+\/?$/,
    sambaBool: z.enum(["yes", "no"], "Invalid samba bool"),
  };

  static readonly reservedShareNames = ["global", "printers", "print$", "config", "backup", "restore"];

  static readonly shareName = z.string().refine((name) => !this.reservedShareNames.includes(name), "Reserved share name");

  static readonly share = z.object({
    path: z.string().regex(this.regex.absPath, "Invalid absolute path"),
    readOnly: this.regex.sambaBool,
    browsable: this.regex.sambaBool,
    validUsers: z.array(z.string().min(1)).min(1, "At least 1 valid user required"),
    adminUsers: z.array(z.string().min(1)).min(1, "At least 1 admin user required"),
    permissions: z.array(z.int().min(0).max(7), "Invalid unix permission").length(3, "Permissions must have exactly 3 values"),
  });

  static readonly shares = z.record(this.shareName, this.share);

  static readonly createShare = z.object({ name: this.shareName }).and(this.share);
  static readonly updateShare = z.object({ name: this.shareName }).and(this.share);
  static readonly deleteShare = z.object({ name: this.shareName });
}
