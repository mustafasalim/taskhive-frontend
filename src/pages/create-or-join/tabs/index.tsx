import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateTabContent from "./contents/create"
import JoinTabContent from "./contents/join"

const CreateAndJoin = () => {
  return (
    <Tabs
      defaultValue="create"
      className="w-[400px]"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="create">Create Workspace</TabsTrigger>
        <TabsTrigger value="join">Join Workspace</TabsTrigger>
      </TabsList>
      <TabsContent value="create">
        <CreateTabContent />
      </TabsContent>
      <TabsContent value="join">
        <JoinTabContent />
      </TabsContent>
    </Tabs>
  )
}

export default CreateAndJoin
