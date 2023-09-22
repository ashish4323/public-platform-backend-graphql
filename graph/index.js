import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
// importing the ql utils
import { Auth } from "./auth/index.js";
import { Connection } from "./connection/index.js";

// creating graphql apolo server and exporting so that can be linked withe express server
async function createApolloGraphqlServer() {
  const qlServer = new ApolloServer({
    typeDefs: `
            ${Auth.typeDefs}
            ${Connection.typedef}
            
            scalar Upload

            type serverResponse {
                success: Boolean!
                data: String!
                setupRequired: Boolean
            }

            type Query {
                ${Auth.queries}
                ${Connection.queries}
            }

            type Mutation {
               ${Auth.mutations}
               ${Connection.mutations}
            }
        `,
    resolvers: {
      User: {
        ...Auth.resolvers.userResolvers,
      },
      Connections: {
        ...Connection.resolvers.connectionTypesResolvers,
      },
      Query: {
        ...Auth.resolvers.queries,
        ...Connection.resolvers.queries,
      },
      Mutation: {
        ...Auth.resolvers.mutations,
        ...Connection.resolvers.mutations,
      },
    },
    introspection: true,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
  });

  await qlServer.start();

  return qlServer;
}

export default createApolloGraphqlServer;
