import { Button } from "@/components/ui/button"
import useUser from "@/lib/hooks/use-user"
import CreateAndJoinTab from "./tabs"
import LogoLightIcon from "@/assets/logo-light-icon.svg"
import LogoDarkIcon from "@/assets/logo-dark-icon.svg"
import { useTheme } from "@/providers/theme-provider"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import queries from "@/queries"

const CreateOrJoinPage = () => {
  const { user } = useUser()
  const { theme } = useTheme()
  const { data } = useQuery(queries.workspaces.getWorkspaces)
  return (
    <div className="w-full h-full">
      <div className="w-full h-screen flex flex-col items-center ">
        <div className="p-4 w-full flex items-center justify-between">
          {data && data.length > 0 ? (
            <Link to="/dashboard">
              <Button variant="ghost">
                <ChevronLeft className="w-4 h-4" />
                Back to Taskhive
              </Button>
            </Link>
          ) : (
            <div></div>
          )}
          <Button
            className="flex flex-col items-start justify-center p-6"
            variant="ghost"
          >
            <div className="text-zinc-400">Logged in as:</div>
            <div>{user?.email}</div>
          </Button>
        </div>
        <div className="w-full h-full flex flex-col  items-center justify-center gap-y-4">
          <img
            width={40}
            height={40}
            src={theme === "dark" ? LogoDarkIcon : LogoLightIcon}
            alt=""
          />
          <h1 className="text-3xl font-bold">Create or join a workspace</h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CreateAndJoinTab />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CreateOrJoinPage
