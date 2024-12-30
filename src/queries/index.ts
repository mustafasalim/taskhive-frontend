import { mergeQueryKeys } from "@lukemorales/query-key-factory"
import workspaces from "./workspaces"
import projects from "./projects"
import statuses from "./statuses"

const queries = mergeQueryKeys(workspaces, projects, statuses)

export default queries
