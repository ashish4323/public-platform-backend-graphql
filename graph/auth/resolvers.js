import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User, Education, WorkExperience } from "../../modals/user.js";

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


const mutations = {};

export const resolvers = { queries, mutations };
