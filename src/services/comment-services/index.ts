import api from "../api"
import { Comment, CreateCommentDto } from "./type"

export const commentServices = {
  createComment: async (
    issueId: string,
    data: CreateCommentDto
  ): Promise<Comment> => {
    const response = await api.post(
      `statuses/${issueId}/issues/comments/create`,
      data
    )
    return response.data
  },

  getCommentsByIssue: async (issueId: string): Promise<Comment[]> => {
    const response = await api.get(`statuses/${issueId}/issues/comments`)
    return response.data
  },
}
