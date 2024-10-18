/* eslint-disable @typescript-eslint/no-explicit-any */
import useModalStore from "@/stores/modal-slice"

export const useModals = () => {
  const modals = useModalStore((state) => state.modals)
  return modals
}

export const createModal = (name: string, data: any = false) => {
  const append = useModalStore.getState().append
  append({
    name,
    data,
  })
}

export const destroyModal = (modalId: string) => {
  const destroy = useModalStore.getState().destroy
  destroy(modalId)
}

export const destroyAllModal = () => {
  const destroyAll = useModalStore.getState().destroyAll
  destroyAll()
}
