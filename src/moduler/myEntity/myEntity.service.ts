import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { IService } from "src/core/interfaces/entity-service.interface";
import { MyEntity } from "./myEntity.entity";
import { MyEntityCreate, MyEntityPatch } from "./myEntity.model";

@Injectable()
export class MyEntityService {
  async create(model: MyEntityCreate): Promise<MyEntity> {
    const myEntity = new MyEntity();
    //TODO: create myEntity here
    Object.getOwnPropertyNames(model).forEach((x) => {
      myEntity[x] = model[x];
    });
    await myEntity.commit();
    return myEntity;
  }

  async findAll(options): Promise<MyEntity[]> {
    try {
      return await MyEntity.findBy(options);
    } catch (e) {
      throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string): Promise<MyEntity> {
    const myEntity = await MyEntity.findOneBy({ id });
    if (myEntity === null)
      throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
    return myEntity;
  }

  async patch(id: string, model: MyEntityPatch): Promise<MyEntity> {
    const myEntity = await this.findOne(id);
    //TODO: patch myEntity here
    Object.getOwnPropertyNames(model).forEach((x) => {
      if (model[x]) {
        myEntity[x] = model[x];
      }
    });
    await myEntity.commit();
    return myEntity;
  }

  async remove(id: string): Promise<MyEntity> {
    const myEntity = await this.findOne(id);
    MyEntity.delete(id);
    return myEntity;
  }
}
