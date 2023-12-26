// hashStore.ts
import { create } from 'zustand';

interface hashStore {
  showHash: string;
  togglehash: (hashId: string) => void;
}

export const useHashStore = create<hashStore>((set) => ({
  showHash: '',
  togglehash: (hashId) => set(() => ({ showHash: hashId })),
}));
