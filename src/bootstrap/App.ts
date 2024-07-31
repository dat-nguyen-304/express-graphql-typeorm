import { createGraphqlSchema } from "./createGraphqlSchema";

import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express from "express";
import http, { Server } from "http";
import { ApolloServer } from "@apollo/server";

// @see https://www.apollographql.com/docs/apollo-server/integrations/middleware/#apollo-server-express
export class App {
  public readonly port: number;
  public readonly app: express.Application;
  public readonly httpServer: Server;

  public constructor() {
    this.port = 7777;
    this.app = express();
    this.httpServer = http.createServer(this.app);
  }

  protected async bootstrap(): Promise<void> {
    this.middlewares();
    await this.startApolloServer();
  }

  protected middlewares(): void {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(cors());
  }

  protected async startApolloServer(): Promise<void> {
    const schema = await createGraphqlSchema();
    const apolloServer = new ApolloServer({
      schema,
      // context: ({ req, res }): AuthedContext =>
      //   new AuthedContext(req as AuthedRequest, res as express.Response),
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
        ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer }),
      ],
    });
    await apolloServer.start();
    this.app.use(
      "/graphql",
      expressMiddleware(apolloServer, {
        context: async ({ req }) => ({ token: req.headers.token }),
      })
    );
    // apolloServer.applyMiddleware({
    //   app: this.app,
    //   cors: true,
    // } as ServerRegistration);
  }

  public async start(): Promise<void> {
    try {
      await this.bootstrap();
      await new Promise((resolve) => {
        this.httpServer.listen(this.port, () => resolve(true));
      });
      console.log(`Server started on http://localhost:${this.port}/graphql`);
    } catch (error) {
      console.log("Start error: ", error);
    }
  }
}
