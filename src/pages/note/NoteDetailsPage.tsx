import { Loading } from "@/components/ui/loading";
import { toastError } from "@/components/ui/toaster";
import { useNoteAction } from "@/contexts/NoteActionContext";
import { useNote } from "@/contexts/NoteContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "@/hooks/useForm";
import { NoteValidator } from "@/models/validator/note";
import { FormLayout } from "@/components/form-layout/FormLayout";
import { pick } from "@/utils/manipulate/object";
import { useAuth } from "@/contexts/AuthContext";
import { type NotePayload, type Note } from "@/models/note";
import { ServerError } from "@/utils/server/serverResponse";
import { CheckCircle2Icon, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareNoteDialog } from "@/components/notes/ShareNoteDialog";
import { useProfile } from "@/contexts/UserContext";
import { type Profile } from "@/models/user";

const DEFAULT_NOTE: Note = {
  content: "",
  createdAt: new Date(),
  deletedAt: null,
  id: "",
  title: "",
  updatedAt: new Date(),
  userId: "",
  visibility: "private",
};

export const NoteDetailsPage = () => {
  const id = useParams().id;
  const isCreatePage = !id;
  const formRef = useRef<HTMLFormElement>(null);

  const { user } = useAuth();
  const { getProfile } = useProfile();
  const {
    exist: { notes },
    loading,
  } = useNote();
  const { getOne, updateOne, createOne } = useNoteAction();
  const [note, setNote] = useState(notes.find((n) => n.id === id));
  const isOwner = !isCreatePage && user?.id === note?.userId;
  const [def, setDef] = useState<NotePayload.CreateNoteBody | NotePayload.UpdateNoteBody>(
    pick(note || DEFAULT_NOTE, ["content", "title", "visibility"]),
  );
  const [saveState, setSaveState] = useState({ loading: false, afterSave: false });
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [publicProfile, setPublicProfile] = useState<Profile | null>(null);

  const formGroup = useForm(def, isCreatePage ? NoteValidator.BODY.createOne : NoteValidator.BODY.updateOne);
  const {
    form: [form, setForm],
    updateField,
  } = formGroup;
  const navigate = useNavigate();
  const editor = useEditor({
    extensions: [StarterKit],
    content: form.content,
    onUpdate: ({ editor }) => updateField("content", editor.getHTML()),
    editable: isCreatePage || isOwner,
  });
  const saveWithDefault = (note: Note) => {
    const clean = pick(note, ["content", "title", "visibility"]);
    setForm(clean);
    setDef(clean);
  };

  const isOld = JSON.stringify(def) === JSON.stringify(form);

  useEffect(() => {
    (async () => {
      if (!note) {
        if (isCreatePage) {
          setNote({ ...DEFAULT_NOTE, userId: user?.id || "" });
          return;
        }
        try {
          const note = await getOne(id);
          setNote(note);
          saveWithDefault(note);
          if (note.userId !== user?.id) {
            setPublicProfile(await getProfile(note.userId));
          }
        } catch (e) {
          toastError(e, { fallback: "Failed to load note" });
          if (e instanceof ServerError && e.getCode() === "FORBIDDEN") navigate("/notes");
        }
      }
    })();
  }, [note]);

  const handleSave = useCallback(
    async (overrides?: Partial<typeof form>) => {
      if (!isCreatePage && !isOwner) return;
      const payload = Object.assign({}, form, overrides);
      if (overrides ? JSON.stringify(def) !== JSON.stringify(payload) : !isOld) {
        try {
          setSaveState({ afterSave: false, loading: true });
          if (isCreatePage) {
            const note = await createOne(payload, { skipLoading: true });
            setNote(note);
            saveWithDefault(note);
            navigate(`/notes/${note.id}`, { replace: true });
          } else {
            const note = await updateOne(id, payload, { skipLoading: true });
            setNote(note);
            saveWithDefault(note);
          }
          setSaveState({ afterSave: true, loading: false });
          setTimeout(() => {
            setSaveState((prev) => ({ ...prev, afterSave: false }));
          }, 1000);
        } catch (err) {
          toastError(err, { fallback: `Failed to ${isCreatePage ? "create" : "update"} note` });
          setSaveState({ afterSave: false, loading: false });
        }
      }
    },
    [isCreatePage, isOld, form, isOwner],
  );

  useEffect(() => {
    const saveShortcut = (e: KeyboardEvent) => {
      if (e.key === "s" && e.ctrlKey) {
        e.preventDefault();
        handleSave();
      }
    };
    document.addEventListener("keydown", saveShortcut);
    return () => document.removeEventListener("keydown", saveShortcut);
  }, [handleSave]);

  if (!note || loading) return <Loading fullScreen />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <FormLayout form={formGroup} ref={formRef} onFormSubmit={() => handleSave()}>
        <div className="flex justify-between">
          <div className="w-2/3">
            <FormLayout.input
              readOnly={isCreatePage ? false : !isOwner}
              fieldId="title"
              classInput="bg-transparent border-none text-2xl font-semibold leading-6 read-only:cursor-default"
              autoFocus={isCreatePage}
              placeholder="Title"
              onBlur={() => formRef.current?.requestSubmit()}
            />
            <div className="flex gap-2 mx-3 text-xs text-dim">
              <p>{new Date(note.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>|
              <p>{editor.getText().replaceAll("\n", "").length} charachters</p>|
              <p>
                {form.visibility === "public" ? (isOwner ? "Shared" : `Author: ${publicProfile ? publicProfile.username : "unknown"}`) : "Private"}
              </p>
            </div>
          </div>
          {isOwner && (
            <div className="flex gap-2 items-center">
              <div className="flex gap-1 items-center text-subtle cursor-default">
                {saveState.loading && <Loading />}
                <AnimatePresence>
                  {saveState.afterSave && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <CheckCircle2Icon className="size-3.5" />
                    </motion.div>
                  )}
                </AnimatePresence>
                {!isCreatePage && <p className="text-xs">{isOld ? "Saved" : "Unsaved"}</p>}
              </div>
              <Button size={"sm"} variant={"outline"} onClick={() => setOpenShareDialog(true)}>
                <Share2 className="size-4.5" />
              </Button>
            </div>
          )}
        </div>
        <FormLayout.richEditor editor={editor} fieldId="content" onBlur={() => formRef.current?.requestSubmit()} />
      </FormLayout>
      <ShareNoteDialog note={note} onClose={() => setOpenShareDialog(false)} open={openShareDialog} onShare={(v) => handleSave({ visibility: v })} />
    </motion.div>
  );
};
