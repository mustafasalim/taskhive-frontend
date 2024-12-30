/* eslint-disable @typescript-eslint/no-explicit-any */
import useModalStore from "@/stores/modal-slice"
import VerifyEmailModal from "./verify-email"
import ForgotPasswordModal from "./forgot-password"
import InviteWorkspaceModal from "./invite-workspace"
import CreateProjectModal from "./create-project"
import EditProjectModal from "./edit-project"
import CreateStatusModal from "./create-status"
import CreateIssueModal from "./create-issue"

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
  {
    name: "create-status",
    element: CreateStatusModal,
  },
  {
    name: "create-issue",
    element: CreateIssueModal,
  },
]

const Modal = () => {
  const { modals } = useModalStore()

  return (
    <>
      {modals.map((modal: any) => {
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
