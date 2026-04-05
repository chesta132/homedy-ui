import type { Note, NotePayload } from "@/models/note";
import { createContext, useContext, type ReactNode } from "react";
import { api } from "@/utils/server/apiClient";
import { type Sort } from "@/models/base";
import { useNote, type NotePageState } from "./NoteContext";

type NoteActionContextValue = {
  fetchNotes: (query?: NotePayload.GetNotesQuery) => Promise<Note[]>;
  refreshNotes: (query?: NotePayload.GetNotesQuery) => Promise<Note[]>;
  ensureNotes: (query?: NotePayload.GetNotesQuery) => Promise<Note[] | null>;
  getNext: (recycled?: boolean) => Promise<Note[] | null>;
  getOne: (id: string) => Promise<Note>;
  createOne: (data: NotePayload.CreateNoteBody) => Promise<Note>;
  updateOne: (id: string, data: NotePayload.UpdateNoteBody) => Promise<Note>;
  deleteOne: (id: string) => Promise<NotePayload.DeleteNoteResponse>;
  deleteMany: (data: NotePayload.DeleteNotesBody) => Promise<NotePayload.DeleteNotesResponse>;
  restoreOne: (id: string) => Promise<Note>;
  restoreMany: (data: NotePayload.RestoreNotesBody, query?: NotePayload.RestoreNotesQuery) => Promise<Note[]>;
};

const NoteActionContext = createContext<NoteActionContextValue | null>(null);

export const NoteActionProvider = ({ children }: { children: ReactNode }) => {
  const { exist, setLoading, trash } = useNote();

  const stateOfPage = (recycled: boolean) => (recycled ? trash : exist);
  const ensureEnsured = ({ ensured, setEnsured }: NotePageState) => (!ensured && setEnsured(true)) || (undefined as void);
  const joinWithSortMode = (old: Note[], news: Note[], sortMode: Sort) => (sortMode === "desc" ? [news, ...old] : [...old, news]) as Note[];

  const refreshNotes = async (query?: NotePayload.GetNotesQuery) => {
    try {
      const state = stateOfPage(!!query?.recycled);
      setLoading(true);
      const notes = await api.get("/notes", { query });
      state.setNotes(notes.data);
      ensureEnsured(state);
      state.setPagination(notes.getPagination());
      return notes.data;
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async (query?: NotePayload.GetNotesQuery) => {
    try {
      const state = stateOfPage(!!query?.recycled);
      setLoading(true);
      const notes = await api.get("/notes", { query });
      state.setNotes((prev) => [...prev, ...notes.data]);
      ensureEnsured(state);
      state.setPagination(notes.getPagination());
      return notes.data;
    } finally {
      setLoading(false);
    }
  };

  const ensureNotes = async (query?: NotePayload.GetNotesQuery) => {
    const { ensured } = stateOfPage(!!query?.recycled);
    if (!ensured) return await refreshNotes(query);
    return null;
  };

  const getNext = async (recycled = false) => {
    const { pagination, sort } = stateOfPage(recycled);
    if (!pagination || pagination.hasNext) {
      try {
        setLoading(true);
        return await fetchNotes({ offset: pagination?.current || 0, recycled, sort });
      } finally {
        setLoading(false);
      }
    }
    return null;
  };

  const getOne = async (id: string) => {
    try {
      setLoading(true);
      const note = exist.notes.find((note) => note.id === id);
      if (note) return note;
      const res = await api.get("/notes/{id}", { param: { id } });
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const createOne = async (data: NotePayload.CreateNoteBody) => {
    try {
      const { setNotes, pagination, setPagination, sort } = exist;
      setLoading(true);
      const note = await api.post("/notes", { data });
      setNotes((prev) => joinWithSortMode(prev, [note.data], sort));
      ensureEnsured(exist);
      if (pagination) {
        setPagination((prev) => prev && { ...prev, current: prev.current + 1, next: prev.next + (prev.hasNext ? 1 : 0) });
      }
      return note.data;
    } finally {
      setLoading(false);
    }
  };

  const updateOne = async (id: string, data: NotePayload.UpdateNoteBody) => {
    try {
      setLoading(true);
      const note = await api.put("/notes/{id}", { data, param: { id } });
      exist.setNotes((prev) => prev.map((prevNote) => (prevNote.id === note.data.id ? note.data : prevNote)));
      return note.data;
    } finally {
      setLoading(false);
    }
  };

  const deleteOne = async (id: string) => {
    try {
      setLoading(true);
      const res = await api.delete("/notes/{id}", { param: { id } });
      exist.setNotes((prev) => prev.filter((prevNote) => prevNote.id !== res.data.id));
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const deleteMany = async (data: NotePayload.DeleteNotesBody) => {
    try {
      setLoading(true);
      const res = await api.delete("/notes", { data });
      exist.setNotes((prev) => prev.filter((prevNote) => !data.ids.includes(prevNote.id)));
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const restoreOne = async (id: string) => {
    try {
      setLoading(true);
      const note = await api.patch("/notes/restore/{id}", { param: { id } });
      exist.setNotes((prev) => joinWithSortMode(prev, [note.data], exist.sort));
      trash.setNotes((prev) => prev.filter((prevNote) => prevNote.id !== note.data.id));
      if (exist.pagination) {
        exist.setPagination((prev) => prev && { ...prev, current: prev.current + 1, next: prev.next + (prev.hasNext ? 1 : 0) });
      }
      if (trash.pagination) {
        trash.setPagination((prev) => prev && { ...prev, current: prev.current - 1, next: prev.next === 0 ? 0 : prev.next - 1 });
      }
      ensureEnsured(exist);
      ensureEnsured(trash);
      return note.data;
    } finally {
      setLoading(false);
    }
  };

  const restoreMany = async (data: NotePayload.RestoreNotesBody, { sort = exist.sort }: NotePayload.RestoreNotesQuery = {}) => {
    try {
      setLoading(true);
      const notes = await api.patch("/notes/restore", { data, query: { sort } });
      exist.setNotes((prev) => joinWithSortMode(prev, notes.data, exist.sort));
      trash.setNotes((prev) => prev.filter((prevNote) => !notes.data.some((data) => data.id === prevNote.id)));
      if (exist.pagination) {
        exist.setPagination((prev) => prev && { ...prev, current: prev.current + 1, next: prev.next + (prev.hasNext ? 1 : 0) });
      }
      if (trash.pagination) {
        trash.setPagination((prev) => prev && { ...prev, current: prev.current - 1, next: prev.next === 0 ? 0 : prev.next - 1 });
      }
      ensureEnsured(exist);
      ensureEnsured(trash);
      return notes.data;
    } finally {
      setLoading(false);
    }
  };

  return (
    <NoteActionContext
      value={{
        createOne,
        ensureNotes,
        fetchNotes,
        getNext,
        getOne,
        deleteOne,
        updateOne,
        deleteMany,
        restoreMany,
        restoreOne,
        refreshNotes,
      }}
    >
      {children}
    </NoteActionContext>
  );
};

export const useNoteAction = () => {
  const ctx = useContext(NoteActionContext);
  if (!ctx) throw new Error("useNoteAction must be used within NoteActionProvider");
  return ctx;
};
