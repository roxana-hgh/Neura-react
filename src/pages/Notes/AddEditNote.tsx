import { useNavigate, useParams } from "react-router-dom";
import { useNotesStore } from "../../components/features/Notes/stores/notes";
import AddEditNoteForm from "../../components/features/Notes/components/AddEditNoteForm";
import type { NoteFormValues } from "../../components/features/Notes/schema/note.schema";

function AddEditNotePage() {
  const { id } = useParams();
  const note = useNotesStore.getState().getNote(id);
  const AddNote = useNotesStore((state) => state.addNote);
  const EditNote = useNotesStore((state) => state.updateNote);
  const navigate = useNavigate();

  const editHandler = (data: NoteFormValues) => {
    if (!id || !note) return;
    const noteData = {
      ...data,
      id: note.id,
      created_at: new Date().toISOString().split("T")[0],
    };
    EditNote(Number(id), noteData)
    navigate(`/note/${note.id}`)
  };
  const AddHandler = (data: NoteFormValues) => {
    const noteData = {
      ...data,
      id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 3,
      created_at: new Date().toISOString().split("T")[0],
    };
    AddNote(noteData)
    navigate(`/notes`)
  };

  return (
    <div className="">
      {id && note ? (
        <div className="">
          <AddEditNoteForm onSubmit={editHandler} note={note} />
        </div>
      ) : (
        <AddEditNoteForm onSubmit={AddHandler} />
      )}
    </div>
  );
}

export default AddEditNotePage;
