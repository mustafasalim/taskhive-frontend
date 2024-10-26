import BottomGradient from "@/components/bottom-gradient"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { invitationServices } from "@/services/invitation-services"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

const formSchema = z.object({
  inviteCode: z.string().min(1, { message: "code is required" }),
})

const JoinTabContent = () => {
  const navigate = useNavigate()

  const joinWorkpsaceMutation = useMutation({
    mutationFn: invitationServices.joinWorkspace,
    onSuccess: () => {
      navigate("/dashboard")
    },
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inviteCode: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    joinWorkpsaceMutation.mutate(values)
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Join Workspace</CardTitle>
        <CardDescription>Enter the code to join workspace</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4"
          >
            <FormField
              control={form.control}
              name="inviteCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Join Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={joinWorkpsaceMutation.isPending}
              variant="animated"
              type="submit"
            >
              {joinWorkpsaceMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                "Join"
              )}
              <BottomGradient />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default JoinTabContent
