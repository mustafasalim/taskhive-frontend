import { Issue } from "@/services/issue-services/type"
import { format } from "date-fns"
import { Calendar, Clock, AlertCircle, Users } from "lucide-react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface IssueCardProps {
  issue: Issue
}

const priorityColors = {
  low: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
  medium: "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
  high: "text-red-500 bg-red-50 dark:bg-red-900/20",
}

const IssueCard = ({ issue }: IssueCardProps) => {
  return (
    <div className="mb-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium">{issue.title}</h4>
        {issue.priority && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs px-2 py-1 rounded-full",
              priorityColors[issue.priority]
            )}
          >
            <AlertCircle className="h-3 w-3" />
            <span className="capitalize whitespace-nowrap">
              {issue.priority}
            </span>
          </div>
        )}
      </div>

      {issue.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {issue.description}
        </p>
      )}

      <div className="space-y-2.5">
        {issue.assignedTo &&
          Array.isArray(issue.assignedTo) &&
          issue.assignedTo.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
              <Users className="h-3 w-3" />
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-2">
                  {issue.assignedTo.slice(0, 3).map((user) => (
                    <Tooltip key={user._id}>
                      <TooltipTrigger>
                        <Avatar className="h-5 w-5 border-2 border-white dark:border-gray-800">
                          <AvatarImage
                            src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`}
                          />
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div>
                          <div>{user.name}</div>
                          <div className="text-xs text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                  {issue.assignedTo.length > 3 && (
                    <div className="h-5 w-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs border-2 border-white dark:border-gray-800">
                      +{issue.assignedTo.length - 3}
                    </div>
                  )}
                </div>
                <span className="ml-1">
                  {issue.assignedTo.length > 3
                    ? `${issue.assignedTo
                        .slice(0, 2)
                        .map((u) => u.name)
                        .join(", ")} and ${issue.assignedTo.length - 2} more`
                    : issue.assignedTo.map((u) => u.name).join(", ")}
                </span>
              </div>
            </div>
          )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>
              Created {format(new Date(issue.createdAt), "MMM d, yyyy")}
            </span>
          </div>
          {issue.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Due {format(new Date(issue.dueDate), "MMM d, yyyy")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default IssueCard
