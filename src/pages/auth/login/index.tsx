import { useTheme } from "@/providers/theme-provider"
import logoDarkIcon from "@/assets/logo-dark-icon.svg"
import logoLightIcon from "@/assets/logo-light-icon.svg"
import { Link } from "react-router-dom"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import LoginForm from "./form"
import { createModal } from "@/stores/store-actions/modal-action"

const Login = () => {
  const { theme } = useTheme()

  function handleClickForgotPassword() {
    createModal({ name: "forgot-password" })
  }

  return (
    <>
      <CardHeader>
        <div className="w-full flex justify-center items-center my-3">
          <img
            className="w-10 h-10 "
            src={theme === "dark" ? logoDarkIcon : logoLightIcon}
          />
        </div>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?
          <Link
            to="/auth/signup"
            className="underline"
          >
            Sign up
          </Link>
          <div>
            Forgot your
            <span
              className="underline cursor-pointer"
              onClick={handleClickForgotPassword}
            >
              Password
            </span>
            ?
          </div>
        </div>
      </CardContent>
    </>
  )
}

export default Login
