// hashStore.ts
import { create } from "zustand";

interface collapseSidebar {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export const usecollapseSidebar = create<collapseSidebar>((set) => ({
  isOpen: false,
  setOpen: (open) => set(() => ({ isOpen: open })),
}));
