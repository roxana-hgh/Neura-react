import { create } from "zustand";
import type { Note } from "../../../../types/Note";

// ─────────────────────────────────────────────
// STORE INTERFACE
// ─────────────────────────────────────────────

export interface NoteStoreState {
  // ── Core data ──────────────────────────────
  Notes: Note[];

  // ── Filter state ───────────────────────────
  search: string;

  // ── Derived / cached ───────────────────────
  filteredNotes: Note[];

  // ── Note actions ───────────────────────────
  getNote: (id: string | number | undefined) => Note | null;
  addNote: (Note: Note) => void;
  removeNote: (id: string | number) => void;
  updateNote: (id: string | number, updates: Partial<Note>) => void;

  // ── Filter actions ─────────────────────────
  setSearch: (value: string) => void;

  //   clearFilters: () => void;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/** Build a fast id→name lookup map from the lists array (O(1) per access) */
// const buildListMap = (lists: NoteList[]): Map<string | number, string> =>
//   new Map(lists.map((l) => [l.id, l.name]));

/** Core filter logic, kept pure so it can be called from any action */
const applyFilters = (notes: Note[], search: string): Note[] => {

  
  const term = search.toLowerCase().trim();

  return notes.filter(note => {
    
    if (!term) return true;      
    return note.title.toLowerCase().includes(term);
  });
};

// ─────────────────────────────────────────────
// INITIAL DATA  (replace with API calls later)
// ─────────────────────────────────────────────

const initialNotes: Note[] = [
  {
    id: 1,
    title: "Note 1",
    created_at: "2026-03-12",
    color: "blue",
    description: "this is some random detail for this Note\nand this is more",
  },
  {
    id: 2,
    title: "Note 2",
    created_at: "2026-03-15",
    color: "yellow",
    description: "this is some random detail for this Note\nand this is more",
  },
  {
    id: 3,
    title: "Note 3",
    created_at: "2026-03-16",
    color: "green",
    description: null,
  },
];

// ─────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────

export const useNotesStore = create<NoteStoreState>((set, get) => ({
  // ── Initial state ──────────────────────────
  Notes: initialNotes,

  search: "",

  filteredNotes: initialNotes,

  // ── Note actions ───────────────────────────

  getNote: (id) : Note | null => {
    if (!id) return null
    const formattedId = Number(id)
    const allNotes = get().Notes;               // یا get().filteredNotes
    const found = allNotes.find(note => note.id === formattedId);
    return found ?? null;
  },

  addNote: (Note) =>
    set((state) => {
      const Notes = [...state.Notes, Note];
      return {
        Notes,
        filteredNotes: applyFilters(Notes, state.search),
      };
    }),

  removeNote: (id) =>
    set((state) => {
      const Notes = state.Notes.filter((t) => t.id !== id);
      return {
        Notes,
        filteredNotes: applyFilters(Notes, state.search),
      };
    }),

  updateNote: (id, updates) =>
    set((state) => {
      const Notes = state.Notes.map((t) =>
        t.id === id ? { ...t, ...updates } : t,
      );
      return {
        Notes,
        filteredNotes: applyFilters(Notes, state.search),
      };
    }),


  // ── Filter actions ─────────────────────────

  setSearch: (value: string) =>
  {
      set((state) => ({
      search: value,
      filteredNotes: applyFilters(state.Notes, value), 
    }))
  }

  //   clearFilters: () =>
  //     set((state) => {
  //       return {
  //         search: "",
  //         filteredNotes: applyFilters(state.Notes, ""),
  //       };
  //     }),
}));
