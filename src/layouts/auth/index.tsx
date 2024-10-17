import { Card } from "@/components/ui/card"
import { Outlet } from "react-router-dom"

const AuthLayouth = () => {
  return (
    <div className="flex items-center justify-center -z-10 h-screen w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:8px_8px]">
      <Card>
        <Outlet />
      </Card>
    </div>
  )
}

export default AuthLayouth
