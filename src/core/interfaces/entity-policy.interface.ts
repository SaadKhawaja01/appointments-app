import { HttpException, HttpStatus } from '@nestjs/common';
import { User } from 'src/app/user/user.entity';

export class BasePolicy {
  protected async authorize(allow: boolean) {
    if (!allow) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}

export interface IPolicy<TEntity> {
  canCreate(auth: User): Promise<void>;
  canFindAll(auth: User): Promise<void>;
  canFindOne(auth: User, entity: TEntity): Promise<void>;
  canPatch(auth: User, entity: TEntity): Promise<void>;
  canDelete(auth: User, entity: TEntity): Promise<void>;
}
