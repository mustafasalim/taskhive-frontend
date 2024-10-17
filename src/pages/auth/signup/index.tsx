import logoDarkIcon from "@/assets/logo-dark-icon.svg"
import logoLightIcon from "@/assets/logo-light-icon.svg"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useTheme } from "@/providers/theme-provider"
import { Link } from "react-router-dom"
import SignupForm from "./form"

const Signup = () => {
  const { theme } = useTheme()

  return (
    <>
      <CardHeader>
        <div className="w-full flex justify-center items-center my-3">
          <img
            className="w-10 h-10 "
            src={theme === "dark" ? logoDarkIcon : logoLightIcon}
          />
        </div>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="underline"
          >
            Login
          </Link>
        </div>
      </CardContent>
    </>
  )
}

export default Signup
