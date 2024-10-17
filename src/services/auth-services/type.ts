export interface IAuthLogin {
  email: string
  password: string
}

export interface IAuthSignup {
  email: string
  password: string
  name: string
}

export interface IAuthVerifyEmail {
  verificationCode: string
}
