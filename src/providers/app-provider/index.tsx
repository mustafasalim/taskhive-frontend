import ModalProvider from "../modal-provider"
import { Outlet } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"

const AppProvider = () => {
  return (
    <>
      <ModalProvider />
      <Toaster />
      <Outlet />
    </>
  )
}

export default AppProvider
