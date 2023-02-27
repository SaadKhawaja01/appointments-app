import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { JwtSecret } from 'src/core/guards/jwt.guard'
import { BcryptService } from 'src/core/services/bcrypt.service'
import { ImageKitService } from 'src/core/services/imagegateway.service'
import { UserController } from './user.controller'
import { UsersPolicy } from './user.policy'
import { UsersService } from './user.service'

@Module({
  controllers: [UserController],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          secret: JwtSecret,
          signOptions: { expiresIn: '3600s' }
        }
      },
      inject: [ConfigService]
    })
  ],

  providers: [UsersService, UsersPolicy, BcryptService, ImageKitService ]
})
export class UserModule {}
