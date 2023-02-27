import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'roles'
export const Roles = (...args: Role[]) => SetMetadata(ROLES_KEY, args)

export enum Role {
  Admin = 'Admin',
  Standard = 'Standard'
}
