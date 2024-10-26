import { mergeQueryKeys } from "@lukemorales/query-key-factory"
import workspaces from "./workspaces"

const queries = mergeQueryKeys(workspaces)

export default queries
