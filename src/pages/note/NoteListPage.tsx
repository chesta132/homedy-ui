import { useNote } from "@/contexts/NoteContext";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PageTitle } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw, StickyNote, Trash2 } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import { useNoteAction } from "@/contexts/NoteActionContext";
import { Link } from "react-router";
import { NoteCard } from "@/components/notes/NoteCard";
import { SelectNoteList } from "@/components/notes/SelectNoteList";

export const NoteListPage = ({ trashPage = false }: { trashPage?: boolean }) => {
  const { exist, loading, trash } = useNote();
  const { notes, sort } = trashPage ? trash : exist;
  const { ensureNotes, refreshNotes, restoreOne } = useNoteAction();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  // TODO: use deleteTarget to delete with confirmation
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    ensureNotes();
  }, []);

  const selectable = selected.size > 0;
  const allSelected = notes.length > 0 && selected.size === notes.length;
  const someSelected = selected.size > 0 && !allSelected;

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageTitle pageTitle="Notes" subtitle={"Save notes over devices"} />
        <div className="flex items-center gap-2">
          <Link to={"/trash/notes"}>
            <Button variant="outline" size="sm">
              <Trash2 className="mr-1.5 size-3.5" />
              Trash
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={() => refreshNotes({ recycled: false, sort })} disabled={loading} className="bg-transparent">
            {loading ? <Loading className="mr-1.5 size-3.5" /> : <RefreshCcw className="mr-1.5 size-3.5" />}
            Refresh
          </Button>
          {/* TODO: add interactive */}
          <Button size="sm">
            <Plus className="mr-1.5 size-3.5" />
            New Note
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {notes.length > 0 && (
          <SelectNoteList
            selected={selected}
            setSelected={setSelected}
            trashMode={false}
            allSelected={allSelected}
            selectable={selectable}
            someSelected={someSelected}
          />
        )}
      </AnimatePresence>

      {loading ? (
        <Loading />
      ) : notes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center flex flex-col items-center justify-center gap-2">
          <StickyNote className="size-10 text-muted-strong" />
          <p className="text-sm text-muted">{"No notes yet — create your first one"}</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note, i) => (
            <motion.div key={note.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <NoteCard
                note={note}
                recycledMode={false}
                selected={selected.has(note.id)}
                onToggleSelect={toggleSelect}
                onDelete={(id) => setDeleteTarget(id)}
                onRestore={restoreOne}
                someSelected={someSelected}
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
