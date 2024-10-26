import { create } from "zustand"
import { IWorkspace } from "@/services/workspace-services/type"

interface WorkspaceState {
  activeWorkspace: IWorkspace | null
  setActiveWorkspace: (workspace: IWorkspace | null) => void
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeWorkspace: null,
  setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
}))
