import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { invitationServices } from "@/services/invitation-services"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import BottomGradient from "@/components/bottom-gradient"

const formSchema = z.object({
  inviteCode: z.string().min(1, {
    message: "Code is required",
  }),
})

const JoinTabContent = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const joinWorkpsaceMutation = useMutation({
    mutationFn: invitationServices.joinWorkspace,
    onSuccess: (data) => {
      // Invalidate workspace members query
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      })
      queryClient.invalidateQueries({
        queryKey: [data.workspace._id, "members"],
      })
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
