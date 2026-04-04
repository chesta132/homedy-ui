import { Endpoints, type EndpointPaths } from ".";
import { NoteValidator } from "@/models/validator/note";

export abstract class NoteEndpoints {
  static readonly PATHS = {
    POST: {
      "/notes": Endpoints.generatePath(NoteValidator.RESPONSE.createOne, { body: NoteValidator.RESPONSE.createOne }),
    },
    GET: {
      "/notes": Endpoints.generatePath(NoteValidator.RESPONSE.getMany, { query: NoteValidator.QUERY.getMany }),
      "/notes/{id}": Endpoints.generatePath(NoteValidator.RESPONSE.getOne, { param: NoteValidator.PARAM.noteId }),
    },
    PUT: {
      "/notes/{id}": Endpoints.generatePath(NoteValidator.RESPONSE.updateOne, { body: NoteValidator.BODY.updateOne }),
    },
    PATCH: {
      "/notes/restore": Endpoints.generatePath(NoteValidator.RESPONSE.restoreOne, { body: NoteValidator.BODY.restoreMany }),
      "/notes/restore/{id}": Endpoints.generatePath(NoteValidator.RESPONSE.restoreOne, { param: NoteValidator.PARAM.noteId }),
    },
    DELETE: {
      "/notes": Endpoints.generatePath(NoteValidator.RESPONSE.deleteMany, { body: NoteValidator.BODY.deleteMany }),
      "/notes/{id}": Endpoints.generatePath(NoteValidator.RESPONSE.deleteOne, { param: NoteValidator.PARAM.noteId }),
    },
  } satisfies EndpointPaths;
}
