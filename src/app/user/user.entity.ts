import { Req } from '@nestjs/common'
import { OrmEntityOmniResponse } from 'src/core/base/orm.entity'
import { Role } from 'src/core/decorators/roles.decorator'
import { auth } from 'src/core/guards/jwt.guard'
import { Column, Entity } from 'typeorm'


import { IUser, IAuthUser, IUserDetails } from './user.dto'

@Entity()
export class User extends OrmEntityOmniResponse<IUser> {
  @Column({ default: 'http://www.gravatar.com/avatar/?d=identicon' })
  avatar: string

  @Column({ default: 'User' + Date.now() })
  name: string

  @Column({ nullable: true })
  legalName: string

  @Column({ nullable: true })
  persona: string

  @Column({ nullable: true })
  email: string

  @Column({ nullable: true })
  secondaryemail: string

  @Column({ nullable: true })
  emailVerifiedAt: Date

  @Column()
  phone: string

  @Column({ nullable: true })
  secondaryphone: string

  @Column({ nullable: true })
  passwordHash: string

  @Column({ default: Role.Standard })
  role: string

  @Column({ nullable: true })
  otpHash: string

  get pid() {
    return `PL` + this.created.getTime()
  }

  get isAdmin() {
    return this.role === Role.Admin
  }

  get isPasswordSetup() {
    return this.passwordHash !== null
  }

  //simple response for user information
  async toResponse(): Promise<IUser> {
    const dto: IUser = {
      id: this.id,
      pid: this.pid,
      avatar: this.avatar,
      name: this.name,
      legalName: this.legalName,
      email: this.email,
      phone: this.phone,
      role: this.role,
      emailVerified: this.emailVerifiedAt !== null,
      passwordSetup: this.isPasswordSetup,
      created: this.created,
      updated: this.updated
    }
    return dto
  }

  //auth response dto
  async authResponseDto(token: string): Promise<IAuthUser> {
    const dto: IAuthUser = {
      ...(await this.toResponse()),
      jwt: token
    }
    return dto
  }


}
