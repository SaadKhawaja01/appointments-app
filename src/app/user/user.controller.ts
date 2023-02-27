import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  UseInterceptors,
  UploadedFile,
  Param
} from '@nestjs/common'
import { IAuthUser, IUser, IUserDetails } from './user.dto'
import { UsersService } from './user.service'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger'
import {
  SigninModel,
  SignupModel,
  CompleteSignupModel,
  SetupAccountModel,
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
import { IMessageResponse } from '../shared/shared.dto'
import { JwtGuard } from 'src/core/guards/jwt.guard'
import { FileInterceptor } from '@nestjs/platform-express'
import { getUserInstance, imageParseFilePipeBuilder } from '../../core/helpers/image.parser'

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() model: SignupModel): Promise<IMessageResponse> {
    const otp = await this.usersService.signup(model)
    return {
      message: `We have sent a one time passcode ${otp} to ${model.phone}`
    }
  }

  @Post('complete-signup')
  async completeSignup(@Body() model: CompleteSignupModel): Promise<IAuthUser> {
    const { user, token } = await this.usersService.completeSignup(model)
    return await user.authResponseDto(token)
  }

  @UseGuards(JwtGuard)
  @Patch('setup-account')
  async setupAccount(@Body() model: SetupAccountModel): Promise<IAuthUser> {
    const { user, token } = await this.usersService.setupAccount(model)
    return await user.authResponseDto(token)
  }

  @Post('signin')
  async signin(@Body() model: SigninModel): Promise<IAuthUser> {
    const { user, token } = await this.usersService.signin(model)
    return await user.authResponseDto(token)
  }

  @Post('forgot-password')
  async forgotPassword(@Body() model: ForgotPasswordModel): Promise<IMessageResponse> {
    const otp = await this.usersService.forgotPassword(model)
    return {
      message: `We have sent a one time passcode ${otp} to ${model.phone}`
    }
  }

  @Post('validate-reset-password')
  async ValidateResetPassword(@Body() model: ValidateResetPassword): Promise<IAuthUser> {
    const { user, token } = await this.usersService.ValidateResetPassword(model)
    return await user.authResponseDto(token)
  }

  @UseGuards(JwtGuard)
  @Patch('reset-password')
  async resetPassword(@Body() model: ResetPasswordModel): Promise<IUser> {
    const user = await this.usersService.resetPassword(model)
    return user.toResponse()
  }

  @UseGuards(JwtGuard)
  @Patch('update-bio')
  async updateBio(@Body() model: UpdateBioModel): Promise<IAuthUser> {
    const { user, token } = await this.usersService.updateBio(model)
    return await user.authResponseDto(token)
  }

  @UseGuards(JwtGuard)
  @Patch('change-password')
  async cangePassword(@Body() model: ChangePasswordModel): Promise<IUser> {
    const user = await this.usersService.changePassword(model)
    return user.toResponse()
  }

  @UseGuards(JwtGuard)
  @Post('change-email')
  async changeEmail(@Body() model: ChangeEmailModel): Promise<IMessageResponse> {
    const otp = await this.usersService.changeEmail(model)
    return {
      message: `We have sent a one time passcode ${otp} to ${model.email}`
    }
  }

  @UseGuards(JwtGuard)
  @Post('complete-change-email')
  async completeChangeEmail(@Body() model: CompleteChangeEmailModel): Promise<IUser> {
    const user = await this.usersService.completeChangeEmail(model)
    return user.toResponse()
  }

  @UseGuards(JwtGuard)
  @Post('change-phone')
  async changePhone(@Body() model: ChangePhoneModel): Promise<IMessageResponse> {
    const otp = await this.usersService.changePhone(model)

    return {
      message: `We have sent a one time passcode ${otp} to ${model.phone}`
    }
  }

  @UseGuards(JwtGuard)
  @Patch('complete-change-phone')
  async completeChangePhone(@Body() model: CompleteChangePhoneModel) {
    const { user, token } = await this.usersService.completeChangePhone(model)
    return await user.authResponseDto(token)
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          // 👈 this property
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @Patch('change-avatar')
  async changeavatar(
    @UploadedFile(imageParseFilePipeBuilder)
    file: any
  ): Promise<IUser> {
    const user = await this.usersService.changeavatar(file)
    return user.toResponse()
  }


}
