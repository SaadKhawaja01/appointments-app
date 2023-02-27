import { BasePolicy, IPolicy } from 'src/core/interfaces/entity-policy.interface'
import { User } from 'src/app/user/user.entity'
import { MyEntity } from './myEntity.entity'

export class MyEntityPolicy extends BasePolicy implements IPolicy<MyEntity> {
  async canCreate(auth: User): Promise<void> {
    const rule = true
    await this.authorize(rule)
  }

  async canFindAll(auth: User): Promise<void> {
    const rule = true
    await this.authorize(rule)
  }

  async canFindOne(auth: User, entity: MyEntity): Promise<void> {
    const rule = true
    await this.authorize(rule)
  }

  async canPatch(auth: User, entity: MyEntity): Promise<void> {
    const rule = true
    await this.authorize(rule)
  }

  async canDelete(auth: User, entity: MyEntity): Promise<void> {
    const rule = true
    await this.authorize(rule)
  }
}
