import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { AuthGuard, PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { Role, ROLES_KEY } from '../decorators/roles.decorator'

import * as bcrypt from 'bcrypt'

import { IJwtPayload } from '../interfaces/user-request.interface'
import { User } from 'src/app/user/user.entity'

export let auth = (): User => null

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtSecret
      // passReqToCallback: true,
    })
  }

  async validate(payload: IJwtPayload) {
    const user = await User.findOneBy({ id: payload.id })
    if (user === null || user.phone !== payload.phone || user.role !== payload.role) {
      auth = () => null
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
    }

    auth = () => user

    return user
  }
}

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext): TUser {
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (requiredRoles) {
      const fulfilled = requiredRoles.some((role) => user.role === role)
      if (fulfilled === false) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
      }
    }

    return user
  }
}

export const JwtSecret = 'vW0szUyLXZMN03JYOWzdo9Brjxavnl5tmLLLDAWu9ugqfz0Je7756v8Ja0iw3Con'
