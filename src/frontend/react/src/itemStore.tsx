// itemStore.ts
import create from 'zustand';

interface ItemStore {
  showItem: number;
  isOpen: boolean;
  toggleItem: (itemId: number) => void;
  setOpen: (open: boolean) => void;
}

export const useItemStore = create<ItemStore>((set) => ({
  showItem: 0,
  isOpen: false,
  toggleItem: (itemId) => set(() => ({ showItem: itemId })),
  setOpen: (open) => set(() => ({ isOpen: open })),
}));
