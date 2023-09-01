import { ApolloServer } from "@apollo/server";

// importing the ql utils
import {Auth} from "./auth/index.js"

// creating graphql apolo server and exporting so that can be linked withe express server
async function createApolloGraphqlServer() {

    const qlServer = new ApolloServer({
        typeDefs:
        `
            type serverResponse {
                success: Boolean!
                data: String!
                setupRequired: Boolean
            }

            type Query {
                ${Auth.queries}
            }

            type Mutation {
               ${Auth.mutations}
            }
        `,
        resolvers:
        {
            Query : {
                ...Auth.resolvers.queries
            },
            Mutation: {
               ...Auth.resolvers.mutations
            }
        }
    })

    await qlServer.start();

    return qlServer
}

export default createApolloGraphqlServer