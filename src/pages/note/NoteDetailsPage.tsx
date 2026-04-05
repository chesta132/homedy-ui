import { Loading } from "@/components/ui/loading";
import { toast } from "@/components/ui/toaster";
import { useNoteAction } from "@/contexts/NoteActionContext";
import { useNote } from "@/contexts/NoteContext";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { motion } from "motion/react";
import { useForm } from "@/hooks/useForm";
import { NoteValidator } from "@/models/validator/note";
import { FormLayout } from "@/components/form-layout/FormLayout";
import { pick } from "@/utils/manipulate/object";
import { useAuth } from "@/contexts/AuthContext";
import { type NotePayload, type Note } from "@/models/note";
import { ServerError } from "@/utils/server/serverResponse";

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

  const formGroup = useForm(def, isCreatePage ? NoteValidator.BODY.createOne : NoteValidator.BODY.updateOne);
  const {
    form: [form, setForm],
    updateField,
  } = formGroup;
  const navigate = useNavigate();
  const editor = useEditor({ extensions: [StarterKit], content: form.content, onUpdate: ({ editor }) => updateField("content", editor.getHTML()) });
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
          const cleanNote = pick(note, ["content", "title", "visibility"]);
          setForm(cleanNote);
          setDef(cleanNote);
        } catch (e) {
          toast.error(e instanceof ServerError ? e.getMessage() : "Failed to save note");
        }
      }
    })();
  }, [note]);

  const handleSubmit = async () => {
    try {
      if (!isOld) {
        if (isCreatePage) {
          const note = await createOne(form, { skipLoading: true });
          setDef(form);
          navigate(`/notes/${note.id}`);
        } else {
          await updateOne(id, form, { skipLoading: true });
          setDef(form);
        }
      }
    } catch {
      // skip err log
    }
  };

  if (!note || loading) return <Loading fullScreen />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <FormLayout form={formGroup} ref={formRef} onFormSubmit={handleSubmit}>
        <div>
          <div>
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
              <p>{editor.getText().replaceAll("\n", "").length} charachters</p>|<p>{form.visibility === "public" ? "Shared" : "Private"}</p>
            </div>
          </div>
        </div>
        <FormLayout.richEditor editor={editor} fieldId="content" onBlur={() => formRef.current?.requestSubmit()} />
      </FormLayout>
    </motion.div>
  );
};
