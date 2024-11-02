import { cn } from "@/lib/utils"

interface IAvatarGroup {
  names: string[]
  className?: string
}
const AvatarGroup = (props: IAvatarGroup) => {
  const { names, className } = props

  return (
    <div className={cn("flex -space-x-4 rtl:space-x-reverse", className)}>
      {names.map((name) => (
        <img
          className="w-6 h-6 border-2 border-white rounded-full dark:border-gray-800"
          src={`https://api.dicebear.com/9.x/initials/svg?seed=${name}`}
          alt=""
        />
      ))}
    </div>
  )
}

export default AvatarGroup
