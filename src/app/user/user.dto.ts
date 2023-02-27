import { IBaseDto } from '../../core/base/base.dto'

export interface ISignup {
  phone: string
}

export interface ICompleteSignup {
  phone: string
  otp: string
}

export interface ISetupAccount {
  name: string
  email: string
  password: string
}

export interface ISignin {
  phone: string
  password: string
}

export interface IForgotPassword {
  phone: string
}
export interface IValidateResetPassword {
  phone: string
  otp: string
}

export interface IResetPassword {
  password: string
}

export interface IUpdateBio {
  legalName: string
  name: string
}

export interface IChangePassword {
  oldPassword: string
  newPassword: string
}

export interface IChangeEmail {
  email: string
}
export interface ICompleteChangeEmail {
  email: string
  otp: string
}

export interface IChangePhone {
  phone: string
}
export interface ICompleteChangePhone {
  phone: string
  otp: string
}

export interface IUser extends IBaseDto {
  pid: string
  avatar: string
  name: string
  legalName: string
  email: string
  phone: string
  role: string
  emailVerified: boolean
  passwordSetup: boolean
}

export interface IAuthUser extends IUser {
  jwt: string
}

export interface IUserDetails extends IUser {
  myFriend: boolean
  room: string
}
