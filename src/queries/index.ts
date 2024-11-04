import { mergeQueryKeys } from "@lukemorales/query-key-factory"
import workspaces from "./workspaces"
import projects from "./projects"

const queries = mergeQueryKeys(workspaces, projects)

export default queries
