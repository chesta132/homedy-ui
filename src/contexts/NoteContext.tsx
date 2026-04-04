import type { Note, NotePayload } from "@/models/note";
import { createContext, useContext, useState, type ReactNode } from "react";
import { api } from "@/utils/server/apiClient";
import { type Pagination } from "@/types/server";
import { type Sort } from "@/models/base";

type NoteContextValue = {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  recycledNotes: Note[];
  setRecycledNotes: React.Dispatch<React.SetStateAction<Note[]>>;

  sortMode: Sort;
  setSortMode: React.Dispatch<React.SetStateAction<"asc" | "desc">>;

  pagination: Pagination | null;
  setPagination: React.Dispatch<React.SetStateAction<Pagination | null>>;

  fetchNotes: (query?: NotePayload.GetNotesQuery) => Promise<Note[]>;
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

const NoteContext = createContext<NoteContextValue | null>(null);

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [sortMode, setSortMode] = useState<Sort>("desc");
  const [recycledNotes, setRecycledNotes] = useState<Note[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [ensured, setEnsured] = useState(false);

  const ensureEnsured = () => (!ensured && setEnsured(true)) || (undefined as void);
  const joinWithSortMode = (old: Note[], news: Note[]) => (sortMode === "desc" ? [news, ...old] : [...old, news]) as Note[];

  const fetchNotes = async (query?: NotePayload.GetNotesQuery, setTo = setNotes) => {
    const notes = await api.get("/notes", { query });
    setTo((prev) => [...prev, ...notes.data]);
    ensureEnsured();
    setPagination(notes.getPagination());
    return notes.data;
  };

  const ensureNotes = async (query?: NotePayload.GetNotesQuery) => {
    if (!ensured) return await fetchNotes(query);
    return null;
  };

  const getNext = async (recycled = false) => {
    if (!pagination || pagination.hasNext) {
      return await fetchNotes({ offset: pagination?.current || 0, recycled, sort: sortMode }, recycled ? setRecycledNotes : setNotes);
    }
    return null;
  };

  const getOne = async (id: string) => {
    const note = notes.find((note) => note.id === id);
    if (note) return note;
    const res = await api.get("/notes/{id}", { param: { id } });
    return res.data;
  };

  const createOne = async (data: NotePayload.CreateNoteBody) => {
    const note = await api.post("/notes", { data });
    setNotes((prev) => joinWithSortMode(prev, [note.data]));
    if (pagination) {
      setPagination((prev) => prev && { ...prev, current: prev.current + 1, next: prev.next + (prev.hasNext ? 1 : 0) });
    }
    ensureEnsured();
    return note.data;
  };

  const updateOne = async (id: string, data: NotePayload.UpdateNoteBody) => {
    const note = await api.put("/notes/{id}", { data, param: { id } });
    setNotes((prev) => prev.map((prevNote) => (prevNote.id === note.data.id ? note.data : prevNote)));
    return note.data;
  };

  const deleteOne = async (id: string) => {
    const res = await api.delete("/notes/{id}", { param: { id } });
    setNotes((prev) => prev.filter((prevNote) => prevNote.id !== res.data.id));
    return res.data;
  };

  const deleteMany = async (data: NotePayload.DeleteNotesBody) => {
    const res = await api.delete("/notes", { data });
    setNotes((prev) => prev.filter((prevNote) => !data.ids.includes(prevNote.id)));
    return res.data;
  };

  const restoreOne = async (id: string) => {
    const note = await api.patch("/notes/restore/{id}", { param: { id } });
    setNotes((prev) => joinWithSortMode(prev, [note.data]));
    setRecycledNotes((prev) => prev.filter((prevNote) => prevNote.id !== note.data.id));
    if (pagination) {
      setPagination((prev) => prev && { ...prev, current: prev.current + 1, next: prev.next + (prev.hasNext ? 1 : 0) });
    }
    ensureEnsured();
    return note.data;
  };

  const restoreMany = async (data: NotePayload.RestoreNotesBody, { sort = sortMode }: NotePayload.RestoreNotesQuery = {}) => {
    const notes = await api.patch("/notes/restore", { data, query: { sort } });
    setNotes((prev) => joinWithSortMode(prev, notes.data));
    setRecycledNotes((prev) => prev.filter((prevNote) => !notes.data.some((data) => data.id === prevNote.id)));
    if (pagination) {
      setPagination((prev) => prev && { ...prev, current: prev.current + 1, next: prev.next + (prev.hasNext ? 1 : 0) });
    }
    ensureEnsured();
    return notes.data;
  };

  return (
    <NoteContext
      value={{
        notes,
        setNotes,
        createOne,
        ensureNotes,
        fetchNotes,
        getNext,
        getOne,
        pagination,
        recycledNotes,
        setPagination,
        setRecycledNotes,
        setSortMode,
        sortMode,
        deleteOne,
        updateOne,
        deleteMany,
        restoreMany,
        restoreOne,
      }}
    >
      {children}
    </NoteContext>
  );
};

export const useNote = () => {
  const ctx = useContext(NoteContext);
  if (!ctx) throw new Error("useNote must be used within NoteProvider");
  return ctx;
};
