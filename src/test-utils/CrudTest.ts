import Maybe from "graphql/tsutils/Maybe";
import gCall from "./gCall";

interface DefaultOptions {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
  methodName: string;
  expectedData?: any;
}

interface CrudOptions {
  create: DefaultOptions;
  get: DefaultOptions;
  getAll: DefaultOptions;
}

interface Options {
  testName: string;
  genData?: () => Promise<any>;
  crud: CrudOptions;
}

function baseObjectNotNullExpec(response: any) {
  expect(response).not.toBeNull();
  expect(response.data).not.toBeNull();
}

function baseNotNull(response: any, method: string = "createStack") {
  baseObjectNotNullExpec(response);
  expect(response.data[method]).not.toBeNull();
  expect(response.data[method].id).not.toBeNull();
  expect(response.data[method].title).not.toBeNull();
}

export const crudTest = ({
  testName,
  genData,
  crud: { create, get, getAll }
}: Options): void => {
  let createdID: string;
  it(`create ${testName}`, async () => {
    let { source, variableValues, methodName, expectedData } = create;
    if (genData) {
      const {
        stackSkillToBeCreated,
        stackSkillCreateExpectedData
      } = await genData();
      variableValues = { data: stackSkillToBeCreated };
      expectedData = stackSkillCreateExpectedData;
    }
    const response = await gCall({
      source,
      variableValues
    });
    baseNotNull(response, methodName);
    expect(response).toMatchObject({
      data: {
        [methodName]: expectedData
      }
    });
    createdID = response.data![methodName].id;
  });
  it(`get added ${testName} by ID`, async () => {
    if (createdID) {
      let { source, methodName, expectedData } = get;
      if (genData) {
        const { stackSkillCreateExpectedData } = await genData();
        expectedData = stackSkillCreateExpectedData;
      }
      const response = await gCall({
        source,
        variableValues: {
          id: createdID
        }
      });
      baseNotNull(response, methodName);
      expectedData.id = createdID;
      expect(response).toMatchObject({
        data: {
          [methodName]: expectedData
        }
      });
    }
  });
  it(`get all ${testName}`, async () => {
    let { source, methodName, expectedData } = getAll;
    if (genData) {
      const { stackSkillCreateExpectedData } = await genData();
      expectedData = stackSkillCreateExpectedData;
    }
    const response = await gCall({
      source
    });

    baseObjectNotNullExpec(response);
    expectedData.id = createdID;
    expect(response.data![methodName]).toContainEqual(expectedData);
  });
};
