/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand"

interface ModalState {
  modals: any[]
  append: (modal: any) => void
  destroy: (modalId: string) => void
  destroyAll: () => void
}

const useModalStore = create<ModalState>((set) => ({
  modals: [],
  append: (modal) => set((state) => ({ modals: [...state.modals, modal] })),
  destroy: (modalId) =>
    set((state) => ({
      modals: state.modals.filter((modal) => modal.id !== modalId),
    })),
  destroyAll: () => set({ modals: [] }),
}))

export default useModalStore
