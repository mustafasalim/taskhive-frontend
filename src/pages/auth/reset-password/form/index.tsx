import BottomGradient from "@/components/bottom-gradient"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { authService } from "@/services/auth-services"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { CircleCheckBig, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

interface IResetPasswordFormProps {
  token: string | undefined
}

const formSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/\d/, { message: "Password must contain at least one number" }),
  confirmPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/\d/, { message: "Password must contain at least one number" }),
})

const ResetPasswordForm = (props: IResetPasswordFormProps) => {
  const { token } = props
  const navigate = useNavigate()

  const resetPasswordMutation = useMutation({
    mutationFn: authService.authResetPassword,
    onSuccess: () => {
      toast({
        description: (
          <div className="flex items-center justify-center gap-x-2">
            <CircleCheckBig className="w-5 h-5 text-green-500 " />
            <span>Reset successfly</span>
          </div>
        ),
      })
      navigate("/auth/login")
    },
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    resetPasswordMutation.mutate({
      token: token ?? "",
      password: values.password,
      confirmPassword: values.confirmPassword,
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={resetPasswordMutation.isPending}
          variant="animated"
          type="submit"
        >
          {resetPasswordMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
          ) : (
            "Reset"
          )}
          <BottomGradient />
        </Button>
      </form>
    </Form>
  )
}

export default ResetPasswordForm
