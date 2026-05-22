import NoteItem from "../../components/features/Notes/components/NoteItem";
import { useNotesStore } from "../../components/features/Notes/stores/notes";
import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import SearchNote from "../../components/features/Notes/components/SearchNote";
import { Link } from "react-router-dom";

function AllNotesPage() {
  const Notes = useNotesStore((state) => state.filteredNotes);

  return (
    <div className="notes-page container mx-auto ">
      <div className="flex items-center justify-between flex-wrap gap-1 mb-3">
        <div className="grow">
          <div className=" ">
            <h3 className="font-bold text-xl mb-1">Your Notes</h3>
            <p className="text-muted-foreground text-sm">
              Here's a list of all your Notes
            </p>
          </div>
        </div>
        <div className="shrink-0 ">
          <div className="flex items-center gap-2">
            <SearchNote />
            <Link to="/notes/add">
              <Button type="button" size="sm" variant="outline">
                Add Note <Plus />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="mb-3 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Notes.map((note) => (
            <NoteItem key={note.id} note={note} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllNotesPage;
