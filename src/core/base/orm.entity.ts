import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm'

export abstract class OrmEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  created: Date

  @Column()
  updated: Date

  async commit() {
    if (this.id === undefined || this.id === null || this.id === '') {
      this.created = new Date()
    }
    this.updated = new Date()
    await this.save()
  }
}

export abstract class OrmEntityOmniResponse<IEntityResponse> extends OrmEntity {
  abstract toResponse(): Promise<IEntityResponse>
}

export abstract class OrmEntityMultiResponse<
  IEntityResponse,
  IEntityDetailResponse
> extends OrmEntity {
  abstract responseDto(): Promise<IEntityResponse>
  abstract detailResponseDto(): Promise<IEntityDetailResponse>
}
