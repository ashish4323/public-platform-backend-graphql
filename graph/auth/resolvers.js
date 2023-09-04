import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User, Education, WorkExperience } from "../../modals/user.js";
import { sendMail} from "../../utils/helper.js"
import { createUploadStream } from "../../utils/helper.js";
import {uid} from "uid"

const queries = {
  
  login: async (parent, { email, password }) => {

    // finding user with given email and is verified
    const user = await User.findOne({ email: email, emailVerified: true })

    if (!user)
        return { success: false, data: "Invalid Email", setupRequired: false};
    
    // comparing password
    const result = await bcrypt.compare(password, user.password)  
    // if password matches
    if (result) 
    {

        const token = jwt.sign({_id: user._id, email: user.email},process.env.SECRET,{ expiresIn: "1h" });
        // setup required
        if (user.accountSetupFinished == false)
              return { success: true, data: token, setupRequired: true };
        // no setup required
        return { success: true, data: token, setupRequired: false};

    } 
    else 
        return { success: false, data: "Invalid Password", setupRequired: false};
          
  },

  // ############# EDUCATION RESOLVERS ###########

  // read
  getEducation: async (parent, {},contextValue) => {
     // check if request is logged in or not
     if(!contextValue || !contextValue.user)
     {
       return {success: false,data:"Request Not Authenticatd"}
     }

     try {

      let educations = await Education.find({user: contextValue.user._id})
      return {success: true,data:"Fetched success",educations}

     }
     catch(err)
     {
      return {success: false,data: err.message}
     }
  },

   // ############# EXPERIENCE RESOLVERS ###########

  // read
  getExperience: async (parent, {},contextValue) => {
    // check if request is logged in or not
    if(!contextValue || !contextValue.user)
    {
      return {success: false,data:"Request Not Authenticatd"}
    }

    try {

     let experiences = await WorkExperience.find({user: contextValue.user._id})
     return {success: true,data:"Fetched success",experiences}

    }
    catch(err)
    {
     return {success: false,data: err.message}
    }
  }


};


const mutations = {

  signup: async (parent,{file,first_name ,last_name , email , mobile_number , work_status , current_city , preferred_location , password}) => {

    try {

        let user = await User.findOne({email})
        // if user already exits
        if(user)
            return {success: false, data: "Email Already in use !"}
  
        let newAccount = new User({first_name, last_name,email,mobile_number,work_status,current_city,preferred_location})
        // hashing pas
        let hasedPassword = await bcrypt.hash(password,10)
        newAccount.password = hasedPassword;

        
        // upload file over aws
        const { file: data } = await file;
        const { filename, createReadStream } = data;
        const stream =   createReadStream();
        const uploadStream = createUploadStream(uid() + filename);
        stream.pipe(uploadStream.writeStream);
        let result  = await uploadStream.promise;
        newAccount.resume = {
                  originalname: data.filename,
                  encoding: data.encoding,
                  mimetype: data.mimetype,
                  key: result.Key,
                  location: result.Location,
                  etag: result.ETag
        }

        // trying to save account
        await newAccount.save()
        
        // generating accrount activation url that has to be sent on email
        const token = jwt.sign({_id: newAccount._id},process.env.SECRET,{expiresIn:'1h'})
        const url = `${process.env.HOSTINGURL}/auth/activate-email/${token}`
        const body = `<h3> Activate Your Account </h3> <br/>
                                <p> Click on the following link to activate your account </p>
                                <a href=${url}> Activate Account </a>` 
  
        await sendMail(body,"Activate your Account !",email)
        // once everything is fine we will sent res
        return {success: true, data: "Account Activation link has been sent on provided email. Please activate your account to use services."}
        
    }

    catch (err)
    {
      return {success: false, data: err.message}
    }

  },

  activateAccount: async (parent,{token}) => {

    try {
      var {_id} = jwt.verify(token, process.env.SECRET);
      let user = await User.findById(_id)
      if(user)
      {
        if(user.emailVerified)
            return {success: true,data: "Account is Already Verified"}
         
        user.emailVerified = true;
        await user.save();

        return {success: true, data: "Email Verified Please Login"}
      }
      else
          return {success: false, data: "Link Expired!"}
      
    } 
    catch(err) {
      return {success: false , data: err.message}
    }

  },

  setupAccountSecondStep: async (parent,{data},contextValue) => {

    // check if request is logged in or not
    if(!contextValue || !contextValue.user)
    {
      return {success: false,data:"Request Not Authenticatd"}
    }

    try {
      const {current_employment,total_work_experience,work_details,key_skills} = data;
      let user = await User.findById(contextValue.user._id)
      
      // if email is not verified
      if(user.emailVerified == false)
          return {success:false,data: "Email not verified"}
  
      // if account is aready styp
      if(user.accountSetupFinished)
          return {success:false,data: "Account is already updated"}
  
      user.current_employment = current_employment
      user.total_work_experience = total_work_experience
      user.work_details = work_details
      user.key_skills = key_skills
  
      await user.save()
      return {success:true,data: "Updated"}
    }
    catch (err) 
    {
      return {success: false, data: err.message}
    }
   
  
  },

  setupAccountThirdStep: async (parent,{bio, gender, currency, amount},contextValue) => {

  // check if request is logged in or not
  if(!contextValue || !contextValue.user)
  {
    return {success: false,data:"Request Not Authenticatd"}
  }

  try 
  {

    let user = await User.findById(contextValue.user._id)

    user.bio = bio;
    user.gender = gender;
    user.prefered_salary = {currency: currency, amount: amount}
       
    await  user.save()
    return {success: true,data:"Account Setup Finished"}
    
  }
  catch(err)
  {
    return {success: false, data: err.message}
  }
  
  },

  addSocialUrls: async (parent,{facebook, twitter, instagram, linkedIn, github, website, youtube},contextValue) => {
    // check if request is logged in or not
    if(!contextValue || !contextValue.user)
    {
      return {success: false,data:"Request Not Authenticatd"}
    }

    try {
        let user = await User.findById(contextValue.user._id)
        user.social_profiles = { facebook,twitter,instagram,linkedIn,github,website,youtube}
        // final step
        user.accountSetupFinished = true
        await  user.save()

        return {success: true, data: "Profile Setup Finished"}
        
    
    }
    catch(err)
    {
      return {success: false, data: err.message}
    }

  },

  // ############# EDUCATION RESOLVERS ###########

  // create
  addEducation: async (parent,{data},contextValue) => {

    // check if request is logged in or not
    if(!contextValue || !contextValue.user)
    {
      return {success: false,data:"Request Not Authenticatd"}
    }

    try {
      const {title,university,course,specialization,course_type,start_date,end_date,course_duration,grading_system} = data;


      let education = new Education({title,university,course,specialization,start_date,end_date,course_type,course_duration,grading_system})

      education.user = contextValue.user._id;

      await  education.save()

      return {success:true,data: "Education Added"}
    }
    catch(err)
    {
      return {success: false, data: err.message}
    }
    
  },

  // update
  updateEducation: async (parent,{data,eduId},contextValue) => {

    // check if request is logged in or not
    if(!contextValue || !contextValue.user)
    {
      return {success: false,data:"Request Not Authenticatd"}
    }

    try {

      const {title,university,course,specialization,course_type,start_date,end_date,course_duration,grading_system} = data;
      await Education.findOneAndUpdate({_id: eduId,user: contextValue.user._id},{title,university,course,specialization,course_type,start_date,end_date,course_duration,grading_system})

      return {success: true, data:"Eduaction Details Updated"}

    }
    catch (err) 
    {
      return {success: false, data: err.message}
    }

  },

  // delete
  deleteEducation: async (parent,{eduId},contextValue) => {

    // check if request is logged in or not
    if(!contextValue || !contextValue.user)
    {
      return {success: false,data:"Request Not Authenticatd"}
    }

    try {
      
      await  Education.findOneAndDelete({_id: eduId,user: contextValue.user._id})
      return {success: true, data:"Eduaction Deleted"}

    }
    catch (err) 
    {
      return {success: false, data: err.message}
    }

  },

  // ############# EXPERIENCE RESOLVERS ###########

  // create
  addExperience: async (parent,{data},contextValue) => {

     // check if request is logged in or not
    if(!contextValue || !contextValue.user)
    {
      return {success: false,data:"Request Not Authenticatd"}
    }

    try
    {
      const {title,employment_type,company_name,location,start_date,end_date,industry,skills}  = data;
   
      const experience = new WorkExperience({title,employment_type,company_name,location,start_date,end_date,industry,skills, 
        user: contextValue.user._id})

      await experience.save()
      return {success: true, data:"Experience Added"}
    }
    catch(err)
    {
      return {success: false,data: err.message}
    }
    
  },

  // update
  updateExperience: async (parent,{data,expId},contextValue) => {

    // check if request is logged in or not
   if(!contextValue || !contextValue.user)
   {
     return {success: false,data:"Request Not Authenticatd"}
   }

   try
   {
      const {title,employment_type,company_name,location,start_date,end_date,industry,skills}  = data;
      await WorkExperience.findOneAndUpdate({_id: expId,user: contextValue.user._id}, {title,employment_type,company_name,location,start_date,end_date,industry,skills})
      return {success: true, data:"Experience Updated"}
   }
   catch(err)
   {
     return {success: false,data: err.message}
   }
   
  },

  // delete
  deleteExperience: async (parent,{expId},contextValue) => {

    // check if request is logged in or not
    if(!contextValue || !contextValue.user)
    {
      return {success: false,data:"Request Not Authenticatd"}
    }

    try {
      
      await  WorkExperience.findOneAndDelete({_id: expId,user: contextValue.user._id})
      return {success: true, data:"Experience Deleted"}

    }
    catch (err) 
    {
      return {success: false, data: err.message}
    }

  },



};

export const resolvers = { queries, mutations };
