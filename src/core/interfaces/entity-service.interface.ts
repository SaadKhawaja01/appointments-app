export interface IService<TEntity, TCreateEntity, TPatchEntity> {
  create(model: TCreateEntity): Promise<TEntity>;
  findAll(options): Promise<TEntity[]>;
  findOne(id: string): Promise<TEntity>;
  patch(id: string, model: TPatchEntity): Promise<TEntity>;
  remove(id: string): Promise<TEntity>;
}
