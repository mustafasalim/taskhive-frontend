import useUser from "@/lib/hooks/use-user"
import { issueServices } from "@/services/issue-services"
import { LiveKitRoom, VideoConference } from "@livekit/components-react"
import "@livekit/components-styles"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

// Get the LiveKit URL from environment variable
const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL

interface MediaRoomProps {
  chatId: string
  video: boolean
  audio: boolean
}

const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { user } = useUser()
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ["livekit-token", chatId, user?.name],
    queryFn: () => issueServices.getLiveKitToken(chatId, user?.name as string),
    enabled: !!user?.name && !!chatId,
  })

  console.log(data)

  if (!LIVEKIT_URL) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <p className="text-xs text-red-500">LiveKit URL not configured</p>
      </div>
    )
  }

  if (!user?.name) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading user data...
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading media room...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <p className="text-xs text-red-500">
          Error loading media room. Please try again.
        </p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          No token available
        </p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      serverUrl={LIVEKIT_URL}
      token={data}
      video={video}
      audio={audio}
      connect={true}
      data-lk-theme="default"
      onDisconnected={() => {
        navigate(-1)
      }}
    >
      <VideoConference />
    </LiveKitRoom>
  )
}

export default MediaRoom
