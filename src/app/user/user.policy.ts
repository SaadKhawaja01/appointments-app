import { BasePolicy, IPolicy } from 'src/core/interfaces/entity-policy.interface'
import { User } from './user.entity'

export class UsersPolicy extends BasePolicy implements IPolicy<User> {
  async canCreate(auth: User): Promise<void> {
    const rule = auth.isAdmin
    await this.authorize(rule)
  }

  async canFindAll(auth: User): Promise<void> {
    const rule = auth.isAdmin
    await this.authorize(rule)
  }

  async canFindOne(auth: User, entity: User): Promise<void> {
    const rule = auth.isAdmin
    await this.authorize(rule)
  }

  async canPatch(auth: User, entity: User): Promise<void> {
    const rule = auth.isAdmin
    await this.authorize(rule)
  }

  async canDelete(auth: User, entity: User): Promise<void> {
    const rule = auth.isAdmin
    await this.authorize(rule)
  }
}
