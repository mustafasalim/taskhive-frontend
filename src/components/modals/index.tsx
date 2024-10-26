import useModalStore from "@/stores/modal-slice"
import VerifyEmailModal from "./verify-email-modal"
import ForgotPasswordModal from "./forgot-password"
import InviteWorkspaceModal from "./invite-workspace"

const modalData = [
  {
    name: "verify-email",
    element: VerifyEmailModal,
  },
  {
    name: "forgot-password",
    element: ForgotPasswordModal,
  },
  {
    name: "invite-workspace",
    element: InviteWorkspaceModal,
  },
]

const Modal = () => {
  const { modals } = useModalStore()

  return (
    <>
      {modals.map((modal) => {
        const modalElement = modalData.find((m) => m.name === modal.name)

        if (modalElement) {
          const Modal = modalElement.element
          return (
            <Modal
              data={modal.data}
              key={modal.id}
            />
          )
        }
      })}
    </>
  )
}

export default Modal
