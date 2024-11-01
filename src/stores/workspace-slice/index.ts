import { create } from "zustand"
import { IActiveWorkspaces } from "@/services/workspace-services/type"

interface WorkspaceState {
  activeWorkspace: IActiveWorkspaces | null
  setActiveWorkspace: (workspace: IActiveWorkspaces | null) => void
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeWorkspace: null,
  setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
}))
