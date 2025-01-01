import { User } from "../issue-services/type"

export interface Comment {
  _id: string
  content: string
  issue: string
  author: User
  createdAt: Date
  updatedAt: Date
}

export interface CreateCommentDto {
  content: string
}
