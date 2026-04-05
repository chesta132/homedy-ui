import z from "zod";

export abstract class BaseValidator {
  static readonly baseModel = z.object({
    id: z.uuidv4(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  });

  static readonly baseRecyclable = z.object({
    deletedAt: z.coerce.date().nullable(),
    ...this.baseModel.shape,
  });

  static readonly HEADERS = {
    appSecret: z.object({ "X-APP-SECRET": z.string() }),
  };

  static readonly TEMPLATE = {
    sort: z.enum(["asc", "desc"], "Invalid enum, must be 'asc' or 'desc'"),
  };
}
