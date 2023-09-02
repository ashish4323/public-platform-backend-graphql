export const mutations = 
`
# GraphQL

signup(file: Upload!, first_name: String!, last_name: String! , email: String!, mobile_number: String!, work_status:String!, current_city: String!, preferred_location: String, password : String! ): serverResponse

activateAccount(token: String!): serverResponse
`