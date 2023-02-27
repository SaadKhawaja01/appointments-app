export interface IController<ICreateEntity, IPatchEntity, IEntityResponse, IEntityDetailResponse> {
  create(model: ICreateEntity, req): Promise<IEntityResponse>;
  findAll(query, req): Promise<IEntityResponse[]>;
  findOne(id: string, req): Promise<IEntityDetailResponse>;
  patch(id: string, model: IPatchEntity, req): Promise<IEntityResponse>;
  remove(id: string, req): Promise<IEntityResponse>;
}
