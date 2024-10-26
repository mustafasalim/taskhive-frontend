/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { saveAccessTokenToLocalStorage } from "@/lib/hooks/use-access-token"
import useUser from "@/lib/hooks/use-user"
import { authService } from "@/services/auth-services"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
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
})

const LoginForm = () => {
  const navigate = useNavigate()
  const { setUser } = useUser()

  const loginMutation = useMutation({
    mutationFn: authService.authLogin,
    onSuccess: (data) => {
      saveAccessTokenToLocalStorage(data.token)

      setUser({
        name: data.user.name,
        email: data.user.email,
        id: data.user._id,
      })
      navigate("/dashboard")
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response.data.message,
        variant: "destructive",
      })
    },
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    loginMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="johndoe@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <Button
          disabled={loginMutation.isPending}
          variant="animated"
          type="submit"
        >
          {loginMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
          ) : (
            "Login"
          )}
          <BottomGradient />
        </Button>
      </form>
    </Form>
  )
}

export default LoginForm
