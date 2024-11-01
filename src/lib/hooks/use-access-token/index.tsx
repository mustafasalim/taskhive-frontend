export const saveAccessTokenToLocalStorage = (accessToken: string) => {
  if (typeof accessToken === "string" && accessToken.trim() !== "") {
    localStorage.setItem("accessToken", accessToken)
  }
}

export const getAccessTokenFromLocalStorage = () => {
  const token = localStorage.getItem("accessToken")

  return token
}

export const removeAccessTokenFromLocalStorage = () => {
  localStorage.removeItem("accessToken")
}
