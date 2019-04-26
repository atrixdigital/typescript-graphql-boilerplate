export default abstract class BaseMethods {
  static async getRelationData(model: any, id: string) {
    const data = await model.findOne(id);
    if (data) {
      return data;
    }
    return null;
  }
}
