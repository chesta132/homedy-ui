import type { Note } from "@/models/note";
import { createContext, useContext, useState, type ReactNode } from "react";
import { type Pagination } from "@/types/server";
import type { Sort } from "@/models/base";

export type NotePageState = {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;

  pagination: Pagination | null;
  setPagination: React.Dispatch<React.SetStateAction<Pagination | null>>;

  sort: Sort;
  setSort: React.Dispatch<React.SetStateAction<Sort>>;

  ensured: boolean;
  setEnsured: React.Dispatch<React.SetStateAction<boolean>>;

  paginationLoading: boolean;
  setPaginationLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

type NoteContextValue = {
  exist: NotePageState;
  trash: NotePageState;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const NoteContext = createContext<NoteContextValue | null>(null);

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const createSharedState = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [sort, setSort] = useState<Sort>("desc");
    const [ensured, setEnsured] = useState(false);
    const [paginationLoading, setPaginationLoading] = useState(false);
    return { notes, setNotes, pagination, setPagination, sort, setSort, ensured, setEnsured, paginationLoading, setPaginationLoading };
  };

  const [loading, setLoading] = useState(false);
  const exist = createSharedState();
  const trash = createSharedState();

  return <NoteContext value={{ exist, trash, loading, setLoading }}>{children}</NoteContext>;
};

export const useNote = () => {
  const ctx = useContext(NoteContext);
  if (!ctx) throw new Error("useNote must be used within NoteProvider");
  return ctx;
};
