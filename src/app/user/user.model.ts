import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator'
import {
  IChangePassword,
  IForgotPassword,
  ISignin as ISignin,
  ISignup,
  IResetPassword,
  ISetupAccount,
  IUpdateBio,
  ICompleteSignup,
  IChangeEmail,
  ICompleteChangeEmail,
  IChangePhone,
  ICompleteChangePhone,
  IValidateResetPassword
} from './user.dto'

export class SignupModel implements ISignup {
  @ApiProperty({ default: '03067103600' })
  @IsNotEmpty()
  phone: string
}

export class CompleteSignupModel implements ICompleteSignup {
  @ApiProperty({ default: '03067103600' })
  @IsNotEmpty()
  phone: string

  @ApiProperty({ default: 12345 })
  @IsNotEmpty()
  otp: string
}

export class SetupAccountModel implements ISetupAccount {
  @ApiProperty({ default: 'secret' })
  @IsNotEmpty()
  password: string

  @ApiProperty({ default: 'Johny Bravo' })
  @IsNotEmpty()
  name: string

  @ApiProperty({ default: 'test@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string
}

export class SigninModel implements ISignin {
  @ApiProperty({ default: '03067103600' })
  @IsNotEmpty()
  phone: string

  @ApiProperty({ default: 'secret' })
  @IsNotEmpty()
  password: string
}

export class ForgotPasswordModel implements IForgotPassword {
  @ApiProperty({ default: '03067103600' })
  @IsNotEmpty()
  phone: string
}

export class ValidateResetPassword implements IValidateResetPassword {
  @ApiProperty()
  @IsNotEmpty()
  otp: string
  @ApiProperty({ default: '03067103600' })
  @IsNotEmpty()
  phone: string
}

export class ResetPasswordModel implements IResetPassword {
  @ApiProperty({ default: 'secret' })
  @IsNotEmpty()
  password: string
}

export class UpdateBioModel implements IUpdateBio {
  @ApiProperty({ default: 'John Miller' })
  @IsOptional()
  legalName!: string

  @ApiProperty({ default: 'Johny Bravo' })
  @IsOptional()
  name: string
}

export class ChangePasswordModel implements IChangePassword {
  @ApiProperty({ default: 'secret' })
  @IsNotEmpty()
  oldPassword: string

  @ApiProperty({ default: 'newSecret' })
  @IsNotEmpty()
  newPassword: string
}

export class ChangeEmailModel implements IChangeEmail {
  @ApiProperty({ default: 'test@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string
}

export class CompleteChangeEmailModel implements ICompleteChangeEmail {
  @ApiProperty({ default: 'test@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ default: 12345 })
  @IsNotEmpty()
  otp: string
}

export class ChangePhoneModel implements IChangePhone {
  @ApiProperty({ default: '03067103600' })
  @IsNotEmpty()
  phone: string
}

export class CompleteChangePhoneModel implements ICompleteChangePhone {
  @ApiProperty({ default: '03067103600' })
  @IsNotEmpty()
  phone: string

  @ApiProperty({ default: 12345 })
  @IsNotEmpty()
  otp: string
}
