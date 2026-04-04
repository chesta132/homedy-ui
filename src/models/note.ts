import type z from "zod";
import type { NoteValidator } from "./validator/note";

export type Note = z.infer<typeof NoteValidator.MODEL.note>;

export namespace NotePayload {
  export type GetNotesQuery = z.infer<typeof NoteValidator.QUERY.getMany>;
  export type RestoreNotesQuery = z.infer<typeof NoteValidator.QUERY.restoreMany>;

  export type CreateNoteBody = z.infer<typeof NoteValidator.BODY.createOne>;
  export type UpdateNoteBody = z.infer<typeof NoteValidator.BODY.updateOne>;
  export type DeleteNotesBody = z.infer<typeof NoteValidator.BODY.deleteMany>;
  export type RestoreNotesBody = z.infer<typeof NoteValidator.BODY.restoreMany>;

  export type DeleteNoteResponse = z.infer<typeof NoteValidator.RESPONSE.deleteOne>;
  export type DeleteNotesResponse = z.infer<typeof NoteValidator.RESPONSE.deleteMany>;
}
