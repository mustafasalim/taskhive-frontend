import useModalStore from "@/stores/modal-slice"
import VerifyEmailModal from "./verify-email"
import ForgotPasswordModal from "./forgot-password"
import InviteWorkspaceModal from "./invite-workspace"
import CreateProjectModal from "./create-project"
import EditProjectModal from "./edit-project"

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
  {
    name: "create-project",
    element: CreateProjectModal,
  },
  {
    name: "edit-project",
    element: EditProjectModal,
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
