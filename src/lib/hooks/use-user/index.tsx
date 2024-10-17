import { useLocalStorage } from "react-use"

interface GetUserDetailsDto {
  email: string // User's email
  name: string // User's name
}

interface ReturnTypes {
  user: GetUserDetailsDto | undefined
  setUser: React.Dispatch<React.SetStateAction<GetUserDetailsDto | undefined>>
  removeUser: () => void
}

const useUser = (): ReturnTypes => {
  const [value, setValue, remove] = useLocalStorage("ph-user", undefined, {
    raw: false,
    serializer: (value: GetUserDetailsDto) => JSON.stringify(value),
    deserializer: (value: string) => JSON.parse(value),
  })

  return {
    user: value,
    setUser: setValue,
    removeUser: remove,
  }
}

export default useUser
