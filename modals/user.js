
import mongoose from "mongoose"

const Schema = mongoose.Schema;

// DESC: collection schema to store education details
const educationSchema = new Schema({
    user: Schema.Types.ObjectId,
    title: String,
    university: String,
    course: String,
    specialization: String,
    course_type: {
        type: String,
        enum: ["full time","part time","distance"],
        default: "full time"
    },
    start_date: Date,
    end_date: Date,
    course_duration: String,
    grading_system: String
})

const Education = mongoose.model("Education",educationSchema)

// DESC: collection schema to store  work experience details
const workExperienceSchema = new Schema({
    user: Schema.Types.ObjectId,
    title: String,
    employment_type: String,
    company_name: String,
    location: String,
    start_date: Date,
    end_date: Date,
    industry: String,
    skills: String,
    certificates: [{
        type: String
    }]
})

const WorkExperience = mongoose.model("WorkExperience",workExperienceSchema)

// DESC: collection schema to store Certificate
const certificateSchema = new Schema({
    user: Schema.Types.ObjectId,
    name: String,
    institute: String,
    file: {
        originalname: String,
        encoding: String,
        mimetype: String,
        key: String,
        location: {
            type: String,
            required: true
        },
        etag: {
            type: String,
            required: true
        }
    },
})
const Certificate = mongoose.model("Certificate",certificateSchema)


// DESC: collection to store the user details
const userSchema = new Schema({

    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    mobile_number: {
        type: String,
        required: true
    },
    work_status: {
        type: String,
        enum: ['fresher','experienced'],
        default: 'fresher'
    },
    resume: {
        originalname: String,
        encoding: String,
        mimetype: String,
        key: String,
        location: {
            type: String,
            required: true
        },
        etag: {
            type: String,
            required: true
        }
    },
    current_city: {
        type: String,
    },
    preferred_location: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    emailVerified: {
        type: Boolean,
        default: false,
        required: true,
        
    },
    accountSetupFinished: {
        type: Boolean,
        default: false,
        required: true
    },
    current_employment: {
        currently_employed: {
            type: Boolean,
            
            default: false
        },
        company: {
            type: String,
            
            default: ""
        },
        job_title: {
            type: String,
           
            default: ""
        }
    },
    total_work_experience: {
        year: Number,
        month: Number
    },
    work_details: {
        start_date: Date,
        present_date: Date,
        annual_salary: Number,
        availabe_to_join: {
            type: String,
            enum: ['15d','1m','2m','3m','3m+']
        },
        industry: String,
        department: String,

    },
    key_skills: {
        type: String
    },
    bio: {
        type: String
    },
    preferred_work_locations: [String],
    prefered_salary: {
        currency: String,
        amount: Number
    },
    gender: {
        type: String,
        enum: ["male","female","others"],
        default: "male"
    },
    social_profiles: {
        facebook: String,
        twitter: String,
        instagram: String,
        linkedIn: String,
        github: String,
        website: String,
        youtube: String
    },
    certificates: [
        {
            type: Schema.Types.ObjectId,
            ref: "Certificate"
        }
    ],
    personal_details: {
        dob: Date,
        physically_challenged: {
            type: Boolean,
            default: false,
            required: true
        },
        marital_status: {
            type: String,
            enum: ["married","unmarried"],
            default: "married"
        }
    }   
    
})
const User = mongoose.model("PPUser",userSchema);

export {Education,WorkExperience,Certificate,User}
