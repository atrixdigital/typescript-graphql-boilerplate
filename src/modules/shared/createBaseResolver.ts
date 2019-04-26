import { Resolver, ClassType, Mutation, Arg, Query } from "type-graphql";

export function createBaseResolver<T extends ClassType, I extends ClassType>(
  suffix: string,
  returnType: T,
  inputType: I,
  entity: any
) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    @Query(() => [returnType], { name: `getAll${suffix}` })
    async getAll() {
      return entity.find();
    }

    @Query(() => returnType, { name: `get${suffix}` })
    async get(@Arg("id", () => String) id: string) {
      return entity.findOne(id);
    }

    @Mutation(() => returnType, { name: `create${suffix}` })
    async create(@Arg("data", () => inputType) data: any) {
      return entity.create(data).save();
    }

    @Mutation(() => [returnType], { name: `createMulti${suffix}` })
    async createMulti(@Arg("data", () => [inputType]) data: any[]) {
      const insertedData = await data.map(
        async obj => await entity.create(obj).save()
      );
      return insertedData;
    }

    async getManyByPropertyID<R>(
      propertyValue: string,
      property: string
    ): Promise<R[]> {
      return entity.find({ where: { [property]: propertyValue } });
    }

    protected async setUpRelation<RT, RE, REI>(
      { propertyValue, property }: { propertyValue: string; property: string },
      relationEntity: RE,
      relationEntityInctance: REI,
      relationProperty: string,
      realtionMethod: string
    ): Promise<RT[]> {
      const data = await (relationEntity as any).find({
        where: { [property]: propertyValue }
      });
      if (data.length <= 0) {
        return [];
      }
      const returnData: RT[] = [];
      (await Promise.all(
        data.map(async (d: any) => {
          const data = await (relationEntityInctance as any)[realtionMethod](
            d[relationProperty]
          );
          if (data) {
            returnData.push(data);
          }
        })
      )) as any;
      return returnData;
    }

    protected async assignRelationData<RT>(
      findID: string,
      relationIDs: string[],
      {
        rEntity,
        where,
        propertyName,
        basePropertyName
      }: {
        rEntity: any;
        where: Object;
        propertyName: string;
        basePropertyName: string;
      }
    ): Promise<RT> {
      const foundData = await entity.findOne(findID);
      if (!foundData) {
        throw new Error("No skill found");
      }
      const relationData = await rEntity.find({
        where
      });
      if (relationData.length > 0) {
        relationData.forEach((rd: any) => {
          if (relationIDs.includes(rd[propertyName])) {
            // remove it
            relationIDs.splice(
              relationIDs.findIndex(id => id === rd[propertyName]),
              1
            );
          }
        });
      }
      if (relationIDs.length > 0) {
        await Promise.all(
          relationIDs.map(id =>
            rEntity
              .create({ [basePropertyName]: findID, [propertyName]: id })
              .save()
          )
        );
      }
      return this.get(findID);
    }
  }

  return BaseResolver;
}
