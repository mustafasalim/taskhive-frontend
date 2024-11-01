interface IAvatarGroup {
  names: string[]
}
const AvatarGroup = (props: IAvatarGroup) => {
  const { names } = props

  return (
    <div className="flex -space-x-4 rtl:space-x-reverse">
      {names.map((name) => (
        <img
          className="w-7 h-7 border-2 border-white rounded-full dark:border-gray-800"
          src={`https://api.dicebear.com/9.x/initials/svg?seed=${name}`}
          alt=""
        />
      ))}
    </div>
  )
}

export default AvatarGroup
