import { Controller, Post, Body, Req, Get, Param, Put, Patch, Delete, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { IMyEntityResponse, IMyEntityDetailResponse } from './myEntity.dto'
import { MyEntityCreate, MyEntityPatch } from './myEntity.model'
import { MyEntityPolicy } from './myEntity.policy'
import { MyEntityService } from './myEntity.service'

@ApiTags('MyEntity')
@Controller('myEntities')
export class MyEntityController {
  constructor(
    private readonly myEntityService: MyEntityService,
    private readonly myEntityPolicy: MyEntityPolicy
  ) {}

  @Get()
  async findAll(@Query() options, @Req() req): Promise<IMyEntityResponse[]> {
    await this.myEntityPolicy.canFindAll(req.auth)
    const myEntities = await this.myEntityService.findAll(options)
    const dto = myEntities.map((myEntity) => myEntity.responseDto())
    return Promise.all(dto)
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req): Promise<IMyEntityDetailResponse> {
    const myEntity = await this.myEntityService.findOne(id)
    await this.myEntityPolicy.canFindOne(req.auth, myEntity)
    const dto = myEntity.detailResponseDto()
    return Promise.resolve(dto)
  }

  @Post()
  async create(@Body() model: MyEntityCreate, @Req() req): Promise<IMyEntityResponse> {
    await this.myEntityPolicy.canCreate(req.auth)
    const myEntity = await this.myEntityService.create(model)
    const dto = myEntity.responseDto()
    return Promise.resolve(dto)
  }

  @Patch(':id')
  async patch(
    @Param('id') id: string,
    @Body() model: MyEntityPatch,
    @Req() req
  ): Promise<IMyEntityResponse> {
    const myEntity = await this.myEntityService.findOne(id)
    await this.myEntityPolicy.canPatch(req.auth, myEntity)
    const patchedEntity = await this.myEntityService.patch(id, model)
    const dto = patchedEntity.responseDto()
    return Promise.resolve(dto)
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req): Promise<IMyEntityResponse> {
    const myEntity = await this.myEntityService.findOne(id)
    await this.myEntityPolicy.canDelete(req.auth, myEntity)
    await this.myEntityService.remove(id)
    const dto = myEntity.responseDto()
    return Promise.resolve(dto)
  }
}
