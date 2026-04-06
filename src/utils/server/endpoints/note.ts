import { generatePath, type EndpointPaths } from ".";
import { NoteValidator } from "@/models/validator/note";

export abstract class NoteEndpoints {
  static readonly PATHS = {
    POST: {
      "/notes": generatePath(NoteValidator.RESPONSE.createOne, { body: NoteValidator.BODY.createOne }),
    },
    GET: {
      "/notes": generatePath(NoteValidator.RESPONSE.getMany, { query: NoteValidator.QUERY.getMany }),
      "/notes/{id}": generatePath(NoteValidator.RESPONSE.getOne, { param: NoteValidator.PARAM.noteId }),
    },
    PUT: {
      "/notes/{id}": generatePath(NoteValidator.RESPONSE.updateOne, {
        body: NoteValidator.BODY.updateOne,
        param: NoteValidator.PARAM.noteId,
      }),
    },
    PATCH: {
      "/notes/restore": generatePath(NoteValidator.RESPONSE.restoreMany, {
        body: NoteValidator.BODY.restoreMany,
        query: NoteValidator.QUERY.restoreMany,
      }),
      "/notes/restore/{id}": generatePath(NoteValidator.RESPONSE.restoreOne, { param: NoteValidator.PARAM.noteId }),
    },
    DELETE: {
      "/notes": generatePath(NoteValidator.RESPONSE.deleteMany, { body: NoteValidator.BODY.deleteMany }),
      "/notes/{id}": generatePath(NoteValidator.RESPONSE.deleteOne, { param: NoteValidator.PARAM.noteId }),
    },
  } satisfies EndpointPaths;
}
