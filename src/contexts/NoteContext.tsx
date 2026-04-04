import type { Note } from "@/models/note";
import { createContext, useContext, useState, type ReactNode } from "react";
import { type Pagination } from "@/types/server";
import type { Sort } from "@/models/base";

type NoteContextValue = {
  exist: {
    notes: Note[];
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;

    pagination: Pagination | null;
    setPagination: React.Dispatch<React.SetStateAction<Pagination | null>>;

    sort: Sort;
    setSort: React.Dispatch<React.SetStateAction<Sort>>;
  };
  trash: {
    notes: Note[];
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;

    pagination: Pagination | null;
    setPagination: React.Dispatch<React.SetStateAction<Pagination | null>>;

    sort: Sort;
    setSort: React.Dispatch<React.SetStateAction<Sort>>;
  };

  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const NoteContext = createContext<NoteContextValue | null>(null);

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const createSharedState = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [sort, setSort] = useState<Sort>("desc");
    return { notes, setNotes, pagination, setPagination, sort, setSort };
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
