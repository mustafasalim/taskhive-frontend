/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { statusServices } from "@/services/status-services"
import { Status } from "@/services/status-services/type"
import { useProjectStore } from "@/stores/project-slice"
import { Button } from "@/components/ui/button"
import { Plus, MoreVertical, GripVertical } from "lucide-react"
import { createModal } from "@/stores/store-actions/modal-action"
import { issueServices } from "@/services/issue-services"
import { Issue } from "@/services/issue-services/type"
import IssueCard from "@/components/issue-card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
} from "react-beautiful-dnd"

const StatusList = () => {
  const queryClient = useQueryClient()
  const { activeProject } = useProjectStore()
  const { data: statuses, isLoading } = useQuery({
    queryKey: ["statuses", activeProject?._id],
    queryFn: () =>
      statusServices.getStatusesByProject(activeProject?._id || ""),
    enabled: !!activeProject?._id,
  })

  // Fetch issues for all statuses in parallel
  const issueQueries = useQuery({
    queryKey: ["issues", statuses?.map((s: Status) => s._id)],
    queryFn: async () => {
      if (!statuses) return []
      const issuePromises = statuses.map((status: Status) =>
        issueServices.getIssuesByStatus(status._id)
      )
      return Promise.all(issuePromises)
    },
    enabled: !!statuses?.length,
  })

  const handleCreateIssue = (status: Status) => {
    createModal({
      name: "create-issue",
      data: { status, open: true },
    })
  }

  const handleUpdateStatus = (status: Status) => {
    createModal({
      name: "update-status",
      data: { status, open: true },
    })
  }

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination || !statuses) return

    // Handle status reordering
    if (result.type === "status") {
      const sourceIndex = result.source.index
      const destinationIndex = result.destination.index

      if (sourceIndex === destinationIndex) return

      const newStatuses = Array.from(statuses) as Status[]
      const [removed] = newStatuses.splice(sourceIndex, 1)
      newStatuses.splice(destinationIndex, 0, removed)

      // Update the order of all affected statuses
      const updatedStatuses = newStatuses.map(
        (status: Status, index: number) => ({
          ...status,
          order: index,
        })
      )

      // Optimistically update the UI
      queryClient.setQueryData(
        ["statuses", activeProject?._id],
        updatedStatuses
      )

      // Update the orders in the backend
      try {
        await Promise.all(
          updatedStatuses.map((status: Status) =>
            statusServices.updateStatus(status._id, { order: status.order })
          )
        )
      } catch (_error) {
        // On error, revert the optimistic update
        queryClient.invalidateQueries({
          queryKey: ["statuses", activeProject?._id],
        })
      }
    }

    // Handle issue dragging between statuses
    if (result.type === "issue") {
      const sourceStatusId = result.source.droppableId
      const destinationStatusId = result.destination.droppableId
      const issueId = result.draggableId

      // Optimistically update the UI
      const sourceIssues =
        queryClient.getQueryData<Issue[]>(["issues", sourceStatusId]) || []
      const destinationIssues =
        queryClient.getQueryData<Issue[]>(["issues", destinationStatusId]) || []

      const [movedIssue] = sourceIssues.splice(result.source.index, 1)
      if (movedIssue) {
        movedIssue.status = destinationStatusId
        destinationIssues.splice(result.destination.index, 0, movedIssue)
      }

      queryClient.setQueryData(["issues", sourceStatusId], sourceIssues)
      queryClient.setQueryData(
        ["issues", destinationStatusId],
        destinationIssues
      )

      try {
        await issueServices.updateIssue(issueId, {
          status: destinationStatusId,
        })
        // Invalidate the main issues query to refresh all lists
        queryClient.invalidateQueries({
          queryKey: ["issues", statuses?.map((s: Status) => s._id)],
        })
      } catch (_error) {
        // On error, revert the optimistic update
        queryClient.invalidateQueries({
          queryKey: ["issues", statuses?.map((s: Status) => s._id)],
        })
      }
    }
  }

  if (isLoading) {
    return <div className="p-4">Loading statuses...</div>
  }

  if (!activeProject) {
    return <div className="p-4">Please select a project first.</div>
  }

  return (
    <div className="flex flex-col h-full">
      <div className="xl:w-[calc(94vw-200px)] h-full lg:w-[calc(84vw-200px)] md:w-[calc(84vw-200px)] flex-1 overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="statuses"
            direction="horizontal"
            type="status"
          >
            {(provided: DroppableProvided) => (
              <div
                className="inline-flex h-full gap-4 p-4"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {statuses?.map((status: Status, index: number) => (
                  <Draggable
                    key={status._id}
                    draggableId={status._id}
                    index={index}
                  >
                    {(provided: DraggableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="w-[360px] h-full flex flex-col bg-white/50 dark:bg-black/20 rounded-lg border overflow-y-auto"
                      >
                        <div
                          className="p-4 border-b shrink-0"
                          {...provided.dragHandleProps}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <GripVertical className="h-4 w-4 text-gray-500 cursor-grab active:cursor-grabbing" />
                              <h3 className="font-medium text-sm truncate">
                                {status.name}
                              </h3>
                              <span className="text-xs text-gray-500 shrink-0">
                                {issueQueries.data?.[index]?.length || 0}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleCreateIssue(status)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(status)}
                                  >
                                    Edit Status
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                        <Droppable
                          droppableId={status._id}
                          type="issue"
                        >
                          {(provided: DroppableProvided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="flex-1 p-2"
                            >
                              {issueQueries.data?.[index]?.map(
                                (issue: Issue, issueIndex: number) => (
                                  <Draggable
                                    key={issue._id}
                                    draggableId={issue._id}
                                    index={issueIndex}
                                  >
                                    {(provided: DraggableProvided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <IssueCard issue={issue} />
                                      </div>
                                    )}
                                  </Draggable>
                                )
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}

export default StatusList
