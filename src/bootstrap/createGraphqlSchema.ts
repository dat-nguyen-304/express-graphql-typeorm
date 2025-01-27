import { UserResolver } from "../modules/users/user.resolver";
import { PostResolver } from "../modules/posts/post.resolver";
import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";

export const createGraphqlSchema = async (): Promise<GraphQLSchema> => {
  return buildSchema({
    resolvers: [UserResolver, PostResolver],
    validate: true,
  });
};
