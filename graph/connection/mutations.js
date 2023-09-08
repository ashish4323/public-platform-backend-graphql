export const mutations = 
`
# Connection Mutations

connectionRequest(userId: String!):  serverResponse!
acceptConnection(connectionId: String!): serverResponse!
rejectConnection(connectionId: String!): serverResponse!
deleteConnection(connectionId: String!): serverResponse!

`
