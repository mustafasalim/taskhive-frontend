/* eslint-disable @typescript-eslint/no-explicit-any */
import useModalStore from "@/stores/modal-slice"

interface ICreateModal {
  name: string
  data?: any
}

interface IDestroyModal {
  modalId: string
}

export const useModals = () => {
  const modals = useModalStore((state) => state.modals)
  return modals
}

export const createModal = (props: ICreateModal) => {
  const { data = false, name } = props
  const append = useModalStore.getState().append
  append({
    name,
    data,
  })
}

export const destroyModal = (props: IDestroyModal) => {
  const { modalId } = props
  const destroy = useModalStore.getState().destroy
  destroy(modalId)
}

export const destroyAllModal = () => {
  const destroyAll = useModalStore.getState().destroyAll
  destroyAll()
}
