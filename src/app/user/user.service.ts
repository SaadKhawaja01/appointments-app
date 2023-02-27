import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { User } from './user.entity'
import {
  SetupAccountModel,
  SigninModel,
  SignupModel,
  CompleteSignupModel,
  ForgotPasswordModel,
  ResetPasswordModel,
  UpdateBioModel,
  ChangePasswordModel,
  ChangeEmailModel,
  CompleteChangeEmailModel,
  ChangePhoneModel,
  CompleteChangePhoneModel,
  ValidateResetPassword
} from './user.model'
import { IJwtPayload } from 'src/core/interfaces/user-request.interface'
import { JwtService } from '@nestjs/jwt'
import { Registration } from './registration.entity'
import { BcryptService } from 'src/core/services/bcrypt.service'
import { ImageKitService } from 'src/core/services/imagegateway.service'
import { auth } from 'src/core/guards/jwt.guard'

@Injectable()
export class UsersService {
  constructor(
    private jwtService: JwtService,
    private readonly bcryptService: BcryptService,
    private readonly imageKitService: ImageKitService
  ) {}

  async signup(model: SignupModel) {
    await this.checkPhoneAvailability(model.phone)

    const [registrations, count] = await Registration.findAndCountBy({
      phone: model.phone
    })

    if (count) {
      await Registration.remove(registrations)
    }

    const otp = this.bcryptService.genOtp()

    const registration = new Registration()
    registration.phone = model.phone
    registration.otpHash = this.bcryptService.makeHash(otp)

    await registration.commit()

    return otp
  }

  async completeSignup(model: CompleteSignupModel) {
    const registration = await Registration.findOneBy({ phone: model.phone })

    if (
      registration === null ||
      this.bcryptService.compareHash(model.otp, registration.otpHash) === false
    ) {
      throw new HttpException(`Invalid otp or signup request`, HttpStatus.BAD_REQUEST)
    }

    await Registration.remove(registration)

    const user = new User()
    user.phone = model.phone
    user.otpHash = null
    await user.commit()

    const token = await this.signUser(user)

    return {
      user,
      token
    }
  }

  async checkPhoneAvailability(phone: string) {
    const user = await User.findOneBy({ phone })

    if (user !== null) {
      throw new HttpException(
        'Phone number already linked with other account',
        HttpStatus.UNPROCESSABLE_ENTITY
      )
    }
  }

  async setupAccount(model: SetupAccountModel) {
    const user = auth()
    if (user.isPasswordSetup) {
      throw new HttpException(
        `Account setup ${user.phone} is alreay complete with ${model.email}`,
        HttpStatus.BAD_REQUEST
      )
    }

    user.name = model.name
    user.passwordHash = this.bcryptService.makeHash(model.password)
    user.email = model.email
    await user.commit()

    const token = await this.signUser(user)

    return { user, token }
  }

  async signin(model: SigninModel) {
    const user = await User.findOneBy({ phone: model.phone })

    if (user === null) {
      throw new HttpException(
        'Account not found linked with this phone number',
        HttpStatus.UNAUTHORIZED
      )
    }

    if (
      user.isPasswordSetup === false ||
      this.bcryptService.compareHash(model.password, user.passwordHash) === false
    ) {
      throw new HttpException('Wrong password. Reset it or try again.', HttpStatus.UNAUTHORIZED)
    }

    const token = await this.signUser(user)
    return { user, token }
  }

  async changePassword(model: ChangePasswordModel) {
    const user = auth()
    if (this.bcryptService.compareHash(model.oldPassword, user.passwordHash) === false) {
      throw new HttpException('Old password is incorrect', HttpStatus.UNAUTHORIZED)
    }

    if (model.oldPassword === model.newPassword) {
      throw new HttpException(
        'Bad Request, Password matched with old password',
        HttpStatus.BAD_REQUEST
      )
    }

    user.passwordHash = this.bcryptService.makeHash(model.newPassword)
    await user.commit()
    return user
  }

  async updateBio(model: UpdateBioModel) {
    const user = auth()
    user.legalName = model.legalName
    user.name = model.name
    await user.commit()
    const token = await this.signUser(user)
    return { user, token }
  }

  async ValidateResetPassword(model: ValidateResetPassword) {
    const user = await User.findOneBy({ phone: model.phone })
    if (user === null) {
      throw new HttpException(
        'No account is linked with this phone number',
        HttpStatus.UNPROCESSABLE_ENTITY
      )
    }

    const invalid = this.bcryptService.compareHash(model.otp, user.otpHash) === false

    if (invalid) {
      throw new HttpException('OTP is invalid', HttpStatus.UNAUTHORIZED)
    }

    user.otpHash = null
    await user.commit()

    const token = await this.signUser(user)
    return { token, user }
  }

  async resetPassword(model: ResetPasswordModel) {
    const user = auth()
    user.passwordHash = this.bcryptService.makeHash(model.password)
    await user.commit()
    return user
  }

  async forgotPassword(model: ForgotPasswordModel) {
    const user = await User.findOneBy({ phone: model.phone })

    if (user === null) {
      throw new HttpException(
        'No account is linked with this phone number',
        HttpStatus.UNPROCESSABLE_ENTITY
      )
    }

    const otp = this.bcryptService.genOtp()
    user.otpHash = this.bcryptService.makeHash(otp)
    await user.commit()

    return otp
  }

  private async signUser(user: User) {
    await user.commit()

    const payload: IJwtPayload = {
      id: user.id,
      pid: user.pid,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }

    return this.jwtService.sign(payload
    //   , {
    //   expiresIn: 
    // }
    )
  }

  async changeEmail(model: ChangeEmailModel) {
    const user = auth()
    const [users, count] = await User.findAndCountBy({ email: model.email })
    if (count) {
      throw new HttpException('Bad Request, email matched with old email', HttpStatus.BAD_REQUEST)
    }

    const otp = this.bcryptService.genOtp()

    user.secondaryemail = model.email
    user.otpHash = this.bcryptService.makeHash(otp)

    await user.commit()

    return otp
  }

  async completeChangeEmail(model: CompleteChangeEmailModel) {
    const user = auth()
    if (user.secondaryemail !== model.email) {
      throw new HttpException('This request is not valid', HttpStatus.BAD_REQUEST)
    }

    const invalid = this.bcryptService.compareHash(model.otp, user.otpHash) === false

    if (invalid) {
      throw new HttpException('OTP is invalid', HttpStatus.UNAUTHORIZED)
    }

    user.email = user.secondaryemail
    user.secondaryemail = null
    await user.commit()
    return user
  }

  async changePhone(model: ChangePhoneModel) {
    const user = auth()
    const users = await User.findOneBy({ phone: model.phone })
    if (users) {
      throw new HttpException(
        'Bad Request, Account already exists on this number',
        HttpStatus.BAD_REQUEST
      )
    }

    const otp = this.bcryptService.genOtp()

    user.secondaryphone = model.phone
    user.otpHash = this.bcryptService.makeHash(otp)

    await user.commit()

    return otp
  }

  async completeChangePhone(model: CompleteChangePhoneModel) {
    const user = auth()
    const phone = await User.findOneBy({ secondaryphone: model.phone })

    if (phone === null) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST)
    }

    const invalid = this.bcryptService.compareHash(model.otp, user.otpHash) === false

    if (invalid) {
      throw new HttpException('OTP is invalid', HttpStatus.UNAUTHORIZED)
    }

    user.phone = user.secondaryphone
    user.secondaryphone = null
    await user.commit()

    const token = await this.signUser(user)
    return { user, token }
  }

  async changeavatar(file) {
    const user = auth()
    const imageKitResponse = await this.imageKitService.upload(file)
    user.avatar = imageKitResponse.thumbnailUrl
    user.commit()
    return user
  }

  async showProfile(id: string) {
    const user = await User.findOneBy({ id: id })
    if (!user) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }
    return user
  }
}
