import { create } from "zustand";

type SelectionStoreValue = {
  selected: Set<string>;
  toggle: (id: string) => void;
  toggleSelectAll: (ids: string[]) => void;
  isSelected: (id: string) => boolean;
  allSelected: (ids: string[]) => boolean;
  clear: () => void;
};

export const useSelectionStore = create<SelectionStoreValue>((set, get) => ({
  selected: new Set(),
  toggle: (id) =>
    set((prev) => {
      const next = new Set(prev.selected);
      next.has(id) ? next.delete(id) : next.add(id);
      return { selected: next };
    }),
  isSelected: (id) => get().selected.has(id),
  allSelected: (ids: string[]) => {
    const { selected } = get();
    return ids.length > 0 && ids.every((id) => selected.has(id));
  },
  clear: () => set({ selected: new Set() }),
  toggleSelectAll: (ids: string[]) => {
    const store = get();
    set({ selected: store.selected.size > 0 || store.allSelected(ids) ? new Set() : new Set(ids) });
  },
}));
