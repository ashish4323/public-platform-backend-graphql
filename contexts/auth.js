
import jwt from "jsonwebtoken"

const decodeTokenAndFetchUser = ({req,res}) => {
    const token = req.headers.authorization || '';

    try {
        const user = jwt.verify(token,process.env.SECRET)
       
        return {user};
    }
    catch(err) {
       
        return null
    }

   
}

export {decodeTokenAndFetchUser}