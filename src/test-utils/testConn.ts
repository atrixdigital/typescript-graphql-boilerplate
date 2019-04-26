import { createConnection } from "typeorm";

export const testConn = (drop: boolean = false) => {
  return createConnection({
    name: "default",
    type: "mongodb",
    url: "mongodb://osama:Osama_6903848@ds211865.mlab.com:11865/myprofile-test",
    useNewUrlParser: true,
    synchronize: drop,
    dropSchema: drop,
    entities: [__dirname + "/../entity/*.*"]
  });
};
