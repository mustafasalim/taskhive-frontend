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

export interface IAuthForgotPassword {
  email: string
}

export interface IAuthResetPassword {
  token: string
  password: string
  confirmPassword: string
}
