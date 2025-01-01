import { Avatar, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Issue } from "@/services/issue-services/type"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { Calendar, Clock, Flag } from "lucide-react"

interface IssueCardProps {
  issue: Issue
}

const priorityConfig = {
  low: {
    color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
    icon: <Flag className="h-3 w-3" />,
    label: "Low Priority",
  },
  medium: {
    color: "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
    icon: <Flag className="h-3 w-3 fill-current" />,
    label: "Medium Priority",
  },
  high: {
    color: "text-red-500 bg-red-50 dark:bg-red-900/20",
    icon: <Flag className="h-3 w-3 fill-current" />,
    label: "High Priority",
  },
}

const IssueCard = ({ issue }: IssueCardProps) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/dashboard/workspace/issues/${issue._id}`)
  }

  return (
    <div
      className="mb-3 p-3 bg-white dark:bg-sidebar rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium">{issue.title}</h4>
        <div className="flex items-center gap-2">
          {issue.assignedTo &&
            Array.isArray(issue.assignedTo) &&
            issue.assignedTo.length > 0 && (
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
            )}
          {issue.priority && (
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs px-2 py-1 rounded-full",
                    priorityConfig[issue.priority].color
                  )}
                >
                  {priorityConfig[issue.priority].icon}
                  <span className="capitalize whitespace-nowrap">
                    {issue.priority}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{priorityConfig[issue.priority].label}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {issue.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {issue.description}
        </p>
      )}

      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span className="text-xs dark:text-gray-300">
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
