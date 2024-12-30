import { useTheme } from "@/providers/theme-provider"
import logoDarkIcon from "@/assets/logo-dark-icon.svg"
import logoLightIcon from "@/assets/logo-light-icon.svg"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import ResetPasswordForm from "./form"
import { useParams } from "react-router-dom"

const ResetPassword = () => {
  const { theme } = useTheme()
  const { token } = useParams()

  return (
    <>
      <CardHeader>
        <div className="w-full flex justify-center items-center my-3">
          <img
            className="w-10 h-10 "
            src={theme === "dark" ? logoDarkIcon : logoLightIcon}
          />
        </div>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your new password below to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm token={token} />
      </CardContent>
    </>
  )
}

export default ResetPassword
