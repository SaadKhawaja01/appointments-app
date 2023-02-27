import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

export enum HashFor {
  Default = '',
  EmailOtp = 'EmailOtp',
  PhoneOtp = 'PhoneOtp'
}

@Injectable()
export class BcryptService {
  genSalt() {
    return bcrypt.genSaltSync(Number(process.env.BSALT_NUMBER) || 10)
  }

  genOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  makeHash(value: string) {
    return bcrypt.hashSync(value, this.genSalt())
  }

  compareHash(plain: string, hash: string) {
    if (!hash) {
      return false
    }
    return bcrypt.compareSync(plain, hash)
  }
}
