import Modal from "@/components/modals"
import useModalStore from "@/stores/modal-slice"

const ModalProvider = () => {
  const { modals } = useModalStore()
  return <>{modals.length > 0 && <Modal />}</>
}

export default ModalProvider
