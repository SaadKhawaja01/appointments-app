import { OrmEntityMultiResponse } from 'src/core/base/orm.entity'
import { Entity } from 'typeorm'
import { IMyEntityResponse, IMyEntityDetailResponse } from './myEntity.dto'
@Entity()
export class MyEntity extends OrmEntityMultiResponse<IMyEntityResponse, IMyEntityDetailResponse> {
  //TODO: define myEntity columns here

  async responseDto(): Promise<IMyEntityResponse> {
    //TODO define myEntity response here
    const dto: IMyEntityResponse = {}
    return dto
  }

  async detailResponseDto(): Promise<IMyEntityDetailResponse> {
    //TODO define myEntity detail response here
    const dto: IMyEntityDetailResponse = {
      ...(await this.responseDto()),
    }
    return dto
  }
}
