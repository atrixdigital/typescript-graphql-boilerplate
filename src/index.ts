import "reflect-metadata";
import { ApolloServer, Config } from "apollo-server-express";
import Express from "express";
import cors from "cors";
import { formatArgumentValidationError } from "type-graphql";
import * as path from "path";
import {
  createConnection,
  getConnectionOptions,
  ConnectionOptions
} from "typeorm";
import { createSchema } from "./utils/createSchema";

const main = async () => {
  const connectionOptions: ConnectionOptions = await getConnectionOptions(
    process.env.NODE_ENV === "production" ? "production" : "default"
  );
  await createConnection({
    ...connectionOptions,
    name: "default"
  });
  const apolloServerOptions: Config = {
    schema: await createSchema(),
    formatError: formatArgumentValidationError,
    playground: true
  };
  if (process.env.NODE_ENV === "production") {
    apolloServerOptions.introspection = true;
  }
  const apolloServer = new ApolloServer(apolloServerOptions);
  const app = Express();
  app.use(Express.static("assets"));
  app.get("/", (_, res) => {
    res.send("Working");
  });
  app.use(
    cors({
      credentials: true,
      origin:
        process.env.NODE_ENV === "production"
          ? (process.env.FRONTEND_URL as string)
          : "*"
    })
  );
  const port = process.env.PORT || 8080;
  app.use(Express.static(path.join(__dirname, "assets")));
  apolloServer.applyMiddleware({
    app,
    cors: false
  });
  app.listen(port, () => {
    console.log(
      `server is running on post ${port} ${process.env.SERVER_URL}/graphql`
    );
  });
};
main();
