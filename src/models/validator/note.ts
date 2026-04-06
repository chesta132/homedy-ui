import z from "zod";
import { BaseValidator } from "./base";
import { UserValidator } from "./user";

export abstract class NoteValidator {
  private static readonly TEMPLATE = {
    visibility: z.enum(["public", "private"], "Invalid enum, must be 'public' or 'private'"),
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
  };

  static readonly MODEL = {
    note: z.object({
      ...BaseValidator.baseRecyclable.shape,
      title: this.TEMPLATE.title,
      content: this.TEMPLATE.content,
      visibility: this.TEMPLATE.visibility,
      userId: UserValidator.MODEL.user.shape.id,
      user: UserValidator.MODEL.user.optional(),
    }),
  };

  static readonly BODY = {
    createOne: z.object({ title: this.TEMPLATE.title, content: this.TEMPLATE.content, visibility: this.TEMPLATE.visibility }),
    updateOne: z.object({
      // optional fields set non optional here for simplify
      title: this.TEMPLATE.title,
      content: this.TEMPLATE.content,
      visibility: this.TEMPLATE.visibility,
    }),
    deleteMany: z.object({
      ids: this.MODEL.note.shape.id.array(),
    }),
    restoreMany: z.object({
      ids: this.MODEL.note.shape.id.array(),
    }),
  };

  static readonly QUERY = {
    getMany: z.object({
      offset: z.number().min(0, "Min offset is 0").optional(),
      recycled: z.boolean().optional(),
      sort: BaseValidator.TEMPLATE.sort.optional(),
    }),
    restoreMany: z.object({
      sort: BaseValidator.TEMPLATE.sort.optional(),
    }),
  };

  static readonly PARAM = {
    noteId: z.object({ id: this.MODEL.note.shape.id }),
  };

  static readonly RESPONSE = {
    createOne: this.MODEL.note,
    getMany: this.MODEL.note.array(),
    getOne: this.MODEL.note,
    updateOne: this.MODEL.note,
    deleteOne: z.object({ id: this.MODEL.note.shape.id }),
    deleteMany: z.null(),
    restoreOne: this.MODEL.note,
    restoreMany: this.MODEL.note.array(),
  };
}
