export const typeDefs = 
`
############## SignupSecondStepSchema #############

input currEmployement {
    currently_employed: Boolean!
    company: String!
    job_title: String!
}

input workExperience {
    year: Int!
    month:Int!
}

input workDetails {
    start_date:String!
    present_date: String!
    annual_salary: Int
    availabe_to_join: String!
    industry: String!
    department: String!
}

input SignupSecondProcessDetails {
    current_employment: currEmployement!
    total_work_experience: workExperience
    work_details: workDetails
    key_skills: String!
}

########### Education #################

input Education {
    title: String!
    university: String!,
    course: String!,
    specialization: String!,
    course_type: String!,
    start_date: String!,
    end_date: String!,
    course_duration: String!,
    grading_system: String!
}   

type EducationO {
    _id: String!
    title: String!
    university: String!,
    course: String!,
    specialization: String!,
    course_type: String!,
    start_date: String!,
    end_date: String!,
    course_duration: String!,
    grading_system: String!
} 

type EducationOutput {
    success: Boolean!
    data: String!
    educations: [EducationO]
}

########### Experience #################

input ExperienceI {
    title: String!,
    employment_type: String!,
    company_name: String!,
    location: String!,
    start_date: String!,
    end_date: String!,
    industry: String!,
    skills: String!
}

type ExperienceO {
    _id: String!
    title: String!,
    employment_type: String!,
    company_name: String!,
    location: String!,
    start_date: String!,
    end_date: String!,
    industry: String!,
    skills: String!
}

type ExperienceOutput {
    success: Boolean!
    data: String!
    experiences: [ExperienceO]
}

type file {
    originalname: String,
    encoding: String,
    mimetype: String,
    key: String,
    location: String
    etag: String
}

########### CERTIFICATES #################
type certificate {
    _id : String!
    user: String!
    name: String!
    institute: String!
    file: file
}

type CertificateOutput {
    success: Boolean!
    data: String!
    certificates: [certificate]
}
########### USER #################


type Current_Employment {
    currently_employed: Boolean
    company: String
    job_title: String
}
type Total_Work_Experience {
    year: Int
    month: Int
}
type workDet {
    start_date:String!
    present_date: String!
    annual_salary: Int
    availabe_to_join: String!
    industry: String!
    department: String!
}
type Salary {
    currency: String
    amount: Int
}
type SocailProfiles {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedIn: String,
    github: String,
    website: String,
    youtube: String
}
type PersonalDetails {
    dob: String
    physically_challenged: Boolean
    marital_status: String
}

type User {

    _id: String
    first_name: String
    last_name: String
    email: String
    mobile_number: String
    work_status: String
    resume: file
    current_city: String
    preferred_location: String
    emailVerified: Boolean
    accountSetupFinished: Boolean
    current_employment: Current_Employment
    total_work_experience: Total_Work_Experience
    work_details: workDet
    key_skills: String
    bio: String
    prefered_salary: Salary
    gender: String
    social_profiles: SocailProfiles
    personal_details: PersonalDetails
    education: [EducationO]
    experience: [ExperienceO]
    certificates: [certificate]
}
`