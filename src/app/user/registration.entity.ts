import { OrmEntity } from 'src/core/base/orm.entity'
import { Column, Entity } from 'typeorm'

@Entity()
export class Registration extends OrmEntity {
  @Column()
  phone: string

  @Column()
  otpHash: string
}
