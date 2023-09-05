export const mutations = 
`
# GraphQL

signup(file: Upload!, first_name: String!, last_name: String! , email: String!, mobile_number: String!, work_status:String!, current_city: String!, preferred_location: String, password : String! ): serverResponse

activateAccount(token: String!): serverResponse

setupAccountSecondStep(data: SignupSecondProcessDetails!): serverResponse

setupAccountThirdStep(bio: String!, gender: String!, currency: String!, amount: Int!): serverResponse

addSocialUrls(facebook: String!, twitter: String!, instagram: String!, linkedIn: String!, github: String!, website: String!, youtube: String!): serverResponse

############ BIO MUTATION ############
editBioSection(bio: String!, key_skills: String!, facebook: String!, twitter: String!, instagram: String!, linkedIn: String!, github: String!, website: String!, youtube: String! ) : serverResponse

############ EDUCATION MUTATIONS ############

addEducation(data: Education!) : serverResponse
updateEducation(data: Education!,eduId: String!) : serverResponse
deleteEducation(eduId: String!) : serverResponse

############ Experience MUTATIONS ############
addExperience(data: ExperienceI!): serverResponse
updateExperience(data: ExperienceI!,expId: String!): serverResponse
deleteExperience(expId: String!): serverResponse


############ CERTIFICATES MUTATIONS ############
addCertificate(file: Upload!, name: String!, university: String!): serverResponse
deleteCertificate(certId: String!): serverResponse

############ PERSONAL DETAILS MUTATION ############
updatePersonalDetails(dob: String!,physically_challenged: Boolean!, marital_status: String!, gender: String!): serverResponse

uploadResume(file: Upload!): serverResponse

`