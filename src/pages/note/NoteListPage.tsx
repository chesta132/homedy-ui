import { useNote } from "@/contexts/NoteContext";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PageTitle } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw, StickyNote, Trash, Trash2 } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import { useNoteAction } from "@/contexts/NoteActionContext";
import { Link } from "react-router";
import { NoteCard } from "@/components/notes/NoteCard";
import { SelectNoteList } from "@/components/notes/SelectNoteList";
import { cn } from "@/lib/utils";
import { DeleteNoteDialog } from "@/components/notes/DeleteNoteDialog";
import { Paginate } from "@/components/ui/paginate";
import type { Note } from "@/models/note";

export const NoteListPage = ({ trashPage = false }: { trashPage?: boolean }) => {
  const { exist, loading, trash } = useNote();
  const { notes, sort, pagination, paginationLoading } = trashPage ? trash : exist;
  const { ensureNotes, refreshNotes, restoreOne, getNext } = useNoteAction();

  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);

  useEffect(() => {
    ensureNotes({ recycled: trashPage });
  }, [trashPage]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Paginate hasNext={pagination?.hasNext} isLoading={paginationLoading || loading} onPaginate={() => getNext(trashPage)} className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <PageTitle pageTitle="Notes" subtitle={trashPage ? "Your notes trash can" : "Save notes over devices"} />
          <div className="flex items-center gap-2">
            <Link to={trashPage ? "/notes" : "/trash/notes"}>
              <Button variant="outline" size="sm" className={cn(trashPage && "text-danger border-danger/30 bg-danger-bg hover:bg-danger-bg-hover")}>
                {trashPage ? (
                  <>
                    <Trash2 className="mr-1.5 size-3.5" />
                    Exit Trash
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-1.5 size-3.5" />
                    Trash
                  </>
                )}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshNotes({ recycled: trashPage, sort })}
              disabled={loading}
              className="bg-transparent"
            >
              {loading ? <Loading className="mr-1.5 size-3.5" /> : <RefreshCcw className="mr-1.5 size-3.5" />}
              Refresh
            </Button>
            <Link to={"/notes/create"}>
              <Button size="sm">
                <Plus className="mr-1.5 size-3.5" />
                New Note
              </Button>
            </Link>
          </div>
        </div>

        <AnimatePresence>{notes.length > 0 && <SelectNoteList trashMode={trashPage} />}</AnimatePresence>

        {loading ? (
          <Loading />
        ) : notes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-16 text-center flex flex-col items-center justify-center gap-2">
            {trashPage ? <Trash className="size-10 text-muted-strong" /> : <StickyNote className="size-10 text-muted-strong" />}
            <p className="text-sm text-muted">{trashPage ? "Trash can is empty" : "No notes yet — create your first one"}</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note, i) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}
              >
                <NoteCard note={note} trashMode={trashPage} onDelete={(note) => setDeleteTarget(note)} onRestore={(n) => restoreOne(n.id)} />
              </motion.div>
            ))}
          </div>
        )}
        <DeleteNoteDialog open={!!deleteTarget} note={deleteTarget} onClose={() => setDeleteTarget(null)} />
      </Paginate>
    </motion.div>
  );
};
