export interface IInviteUser {
  email: string
  workspaceId: string
  role: "operator" | "member"
}
export interface IJoinWorkspace {
  inviteCode: string
}
