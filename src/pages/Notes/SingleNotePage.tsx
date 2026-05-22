import { Link, useNavigate, useParams } from "react-router-dom";
import { useNotesStore } from "../../components/features/Notes/stores/notes";
import { getNoteColorClass } from "../../components/features/Notes/utils/ColorMapper";
import { ChevronLeftIcon, ChevronsLeftIcon, Edit, StickyNoteIcon, Trash } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import AlertDialog from "../../components/utils/AlertDialog";
import { EditorBlocksDisplay } from "../../components/utils/BlocksToHtml";
import NoteContent from "../../components/features/Notes/utils/NoteContent";

function SingleNotes() {
  const navigate = useNavigate();
  const { id } = useParams();
  const note = useNotesStore.getState().getNote(id);
  const deleteNote = useNotesStore((state) => state.removeNote);

  const [alertOpen, setAlertOpen] = useState(false);

  const OnDeleteHandler = () => {
    if (!id) return;
    setAlertOpen(true);
  };

  const DeleteNote = () => {
    if (!id) return;
    deleteNote(Number(id));
    navigate("/notes");
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
         <div className="flex flex-col gap-3">
         
           <div className="icon mb-2">
            <span
              className={`${getNoteColorClass(note?.color ?? "gray")} p-2 aspect-square w-fit block rounded-md border`}
            >
              <StickyNoteIcon size={18} />
            </span>
          </div>
         </div>
          {note && (
            <div className="flex gap-2">
               <Link to={`/notes`}>
              <Button type="button" className="cursor-pointer" size="icon-sm" variant="outline">
               <ChevronLeftIcon size={14}/>
              </Button>
              </Link>
              <Link to={`/note/${note.id}/edit`}>
              <Button type="button" size="sm" variant="outline">
                Edit Note <Edit />
              </Button>
              </Link>
              <Button
                className="text-red-500 bg-red-300/20 border-red-400 hover:bg-red-300/30 cursor-pointer"
                type="button"
                size="icon-sm"
                onClick={OnDeleteHandler}
              >
                <Trash />
              </Button>
            </div>
          )}
        </div>
        <h2 className="text-3xl font-bold mb-2">{note?.title}</h2>
        <div className="flex mb-2">
          <span className="text-sm flex gap-3 text-muted-foreground">
            Created :{" "}
            {note
              ? new Date(note.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : ""}
          </span>
        </div>
        
        {/* Display editor blocks or fallback to description */}
         {note?.description ? <NoteContent html={note.description} /> : "..."}
      </div>
      {alertOpen && (
        <AlertDialog
          title="Remove Note"
          description={`Are you Sure you want to Remove '${note?.title}' ? `}
          acceptButtonText="Remove"
          AcceptButtonVariant="danger"
          open={alertOpen}
          setOpen={setAlertOpen}
          onConfirm={DeleteNote}
        />
      )}
    </>
  );
}

export default SingleNotes;
