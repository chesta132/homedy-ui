import z from "zod";

export abstract class BaseValidator {
  static readonly baseModel = z.object({
    id: z.uuidv4(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  });

  static readonly baseRecyclable = z
    .object({
      deletedAt: z.coerce.date(),
    })
    .and(this.baseModel);
}
