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

  }



};

export const resolvers = { queries, mutations };
