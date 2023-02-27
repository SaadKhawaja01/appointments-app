import { Module } from '@nestjs/common'
import { MyEntityController } from './myEntity.controller'
import { MyEntityPolicy } from './myEntity.policy'
import { MyEntityService } from './myEntity.service'

@Module({
  controllers: [MyEntityController],
  providers: [MyEntityService, MyEntityPolicy],
})
export class MyEntityModule {}
