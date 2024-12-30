import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import queries from "@/queries"
import { IProject } from "@/services/project-services/type"
import { statusServices } from "@/services/status-services"
import { useWorkspaceStore } from "@/stores/workspace-slice"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"

const IssuesPageHeaderActions = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  )
  const { activeWorkspace } = useWorkspaceStore()

  const { data, refetch } = useQuery({
    ...queries.projects.getProjects(activeWorkspace?._id as string),
    enabled: !!activeWorkspace?._id,
  })

  const createStatusMutation = useMutation({
    mutationFn: statusServices.createStatus,
  })

  const handleClickCreateStatus = () => {
    createStatusMutation.mutate({
      name: "todo",
      order: 1,
      projectId: `${selectedProjectId}`,
    })
  }

  useEffect(() => {
    refetch()
  }, [])

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={handleClickCreateStatus}
        variant="outline"
        size="sm"
      >
        <Plus className="mx-auto h-4 w-4" />
        create status
      </Button>
      <Select
        defaultValue={data && data[0].id}
        onValueChange={(value) => setSelectedProjectId(value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Projects" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Projects</SelectLabel>
            {data &&
              data.map((project: IProject) => (
                <SelectItem
                  key={project.id}
                  value={project.id}
                >
                  <div className="flex items-center gap-x-2">
                    <img
                      className="rounded-md"
                      width={20}
                      height={20}
                      src={`https://api.dicebear.com/9.x/identicon/svg?seed=${project.name}`}
                      alt=""
                    />
                    <div>{project.name}</div>
                  </div>
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default IssuesPageHeaderActions
