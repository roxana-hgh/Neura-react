import { useMemo } from "react";
import { useNotesStore } from "../stores/notes";
import type { Note } from "../../../../types/Note";

export const useGetAllNotes = () => {
  const filteredNotes = useNotesStore((s) => s.filteredNotes);

  return useMemo((): Note[] => {
    return [...filteredNotes];
  }, [filteredNotes]);
};

export const useGetSingleNote = (_Id: number | string | undefined)  => {
  const Notes = useNotesStore((s) => s.Notes);
  if (!_Id) return null
  return Notes.filter(note => note.id === _Id)
};
