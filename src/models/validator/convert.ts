import z from "zod";

export abstract class ConvertValidator {
  static readonly PAIRS = {
    html: ["md"],
    md: ["html"],
    pdf: ["docx", "pptx"],
    xlsx: ["pdf", "csv"],
    docx: ["pdf"],
    pptx: ["pdf"],
    csv: ["xlsx"],
  };

  static readonly FILE_LIMITS = {
    /** 2MB */
    html: 2 << 20,
    /** 2MB */
    md: 2 << 20,
    /** 5MB */
    csv: 5 << 20,
    /** 10MB */
    xlsx: 10 << 20,
    /** 10MB */
    docx: 10 << 20,
    /** 10MB */
    pptx: 10 << 20,
    /** 15MB */
    pdf: 15 << 20,
  };

  private static isValidPair = (from: string, to: string): boolean => this.PAIRS[from as keyof typeof this.PAIRS]?.includes(to) ?? false;

  private static fileWithConvertTo = (file: File) => {
    const ext = file.name.split(".").pop() ?? "";

    return z.string().superRefine((val, ctx) => {
      if (!ext) {
        ctx.addIssue({ code: "custom", message: `Unknown file extension -> ${val} is not a valid pair` });
        return;
      }
      if (!this.isValidPair(ext, val)) {
        ctx.addIssue({ code: "custom", message: `${ext} -> ${val} is not a valid pair` });
      }

      const limit = this.FILE_LIMITS[ext as keyof typeof this.FILE_LIMITS];
      if (limit && file.size > limit) {
        ctx.addIssue({ code: "custom", message: `File size exceeds limit of ${limit} bytes` });
      }
    });
  };

  static readonly BODY = {
    convertOne: z
      .object({
        file: z.instanceof(File),
        convertTo: z.string().min(1),
      })
      .superRefine((val, ctx) => {
        const result = this.fileWithConvertTo(val.file).safeParse(val.convertTo);
        if (!result.success) {
          result.error.issues.forEach((issue) => ctx.addIssue({ ...issue, path: ["convertTo"] }));
        }
      }),

    convertMultiple: z
      .object({
        files: z.array(z.instanceof(File)).min(1),
        convertTo: z.array(z.string().min(1)),
      })
      .superRefine((val, ctx) => {
        if (val.files.length !== val.convertTo.length) {
          ctx.addIssue({ code: "custom", message: "files and convertTo must have the same length", path: ["convertTo"] });
          return;
        }

        val.files.forEach((file, i) => {
          const result = this.fileWithConvertTo(file).safeParse(val.convertTo[i]);
          if (!result.success) {
            result.error.issues.forEach((issue) => ctx.addIssue({ ...issue, path: ["convertTo", i] }));
          }
        });
      }),
  };
}
