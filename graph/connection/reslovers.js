// CONNECTION RESOLVERS

import {Connection} from "../../modals/connections.js"

const queries = {
    getConnections: async (parent,{},contextValue) => {

     // check if request is logged in or not
    if(!contextValue || !contextValue.user)
    {
        return {success: false,data:"Request Not Authenticatd"}
    } 

    try
    {
        // Fetch All the connections of the current user weather sent or receved but must be accepted
        let connections = await Connection.find(
            {status:"accepted", $or: [{connectionBy:contextValue.user._id}, {connectionTo: contextValue.user._id}]})

    
        return {success: true, connections}
    }
    catch(err)
    {
        return {success: false, data: err.message}
    }

    }
}

const mutations = {

    connectionRequest: async (parent,{userId},contextValue) => {
    
        // check if request is logged in or not
        if(!contextValue || !contextValue.user)
        {
            return {success: false,data:"Request Not Authenticatd"}
        } 
        
        try 
        {
            // check if the given user is already in the connection
            let con = (await Connection.findOne({connectionBy: contextValue.user._id,connectionTo: userId }))
            if(con)
                return {success: false,data:"Connection Already Exists"}
                
            let connection = new Connection({connectionBy: contextValue.user._id,connectionTo: userId})
            await connection.save();
            return {success: true,data: "Request Sent"}

        }
        catch(err)
        {
            return {success: false,data: err.message}
        }

    },

    acceptConnection: async (parent,{connectionId},contextValue) => {
        // check if request is logged in or not
        if(!contextValue || !contextValue.user)
        {
            return {success: false,data:"Request Not Authenticatd"}
        } 
        
        // find the requested connections by validating parameters
        try 
        {
            let conn = await Connection.findOne({_id: connectionId , connectionTo: contextValue.user._id, status: "pending" })
            if(!conn)
            {
                return {success: false,data:"Request Already Accepted"}
            }

            conn.status = "accepted"
            await conn.save()
            return {success: true, data: "Request Accepted"}
        }
        catch(err)
        {
            return {success: false, data:err.message}
        }
    },

    rejectConnection: async (parent,{connectionId},contextValue) => {
        // check if request is logged in or not
        if(!contextValue || !contextValue.user)
        {
            return {success: false,data:"Request Not Authenticatd"}
        } 

        // find the requested connections by validating parameters
        try 
        {
            let conn = await Connection.findOne({_id: connectionId , connectionTo: contextValue.user._id, status: "pending" })
            if(!conn)
            {
                return {success: false,data:"Request Already Rejected!"}
            }

            conn.status = "rejected"
            await conn.save()
            return {success: true, data: "Request  Rejected"}
        }
        catch(err)
        {
            return {success: false, data:err.message}
        }
    },

    deleteConnection: async (parent,{connectionId},contextValue) => {
      // check if request is logged in or not
      if(!contextValue || !contextValue.user)
      {
        return {success: false,data:"Request Not Authenticatd"}
      } 

        // find the requested connection
        try 
        {
            await Connection.findOneAndDelete({_id:connectionId, status: "accepted", 
                                                $or: [{connectionBy:contextValue.user._id}, {connectionTo: contextValue.user._id}] })


            return {success: true, data: "Connection  Deleted"}
        }
        catch(err)
        {
            return {success: false, data:err.message}
        }
    }


}

// It should return and Array of USER 
const connectionTypesResolvers = {

    sentAccepted: async (parent,{connection},contextValue)  =>
    {
        // the temp is any array of objects containing documents of connection schema. But this resolver has to return the array of type User so we cannot return the temp directly. So first we will make an array of User extrating the required feild from temp and we need to return the connectionDoc id so that front end can accept or rejcet it by connectionId so we have to merge the userData + ConnectoionId and make a single doucment and will return it
       let temp = await Connection.find({connectionBy: contextValue.user._id , status:"accepted" }).populate("connectionTo")
       return temp.map(item => Object.assign({connectionId:item._id},item.connectionTo._doc))
    },
    
    sentPending: async (parent,{connection},contextValue)  => {
        let temp = await Connection.find({connectionBy: contextValue.user._id , status:"pending" }).populate("connectionTo")
        return temp.map(item => Object.assign({connectionId:item._id},item.connectionTo._doc))
    },

    sentRejected: async (parent,{connection},contextValue)  => 
    {
        let temp = await Connection.find({connectionBy: contextValue.user._id , status:"rejected" }).populate("connectionTo")
        return temp.map(item => Object.assign({connectionId:item._id},item.connectionTo._doc))
    },
  
    receivedAccepted: async (parent,{connection},contextValue)  =>
    {
        let temp = await Connection.find({connectionTo: contextValue.user._id , status:"accepted" }).populate("connectionBy")
        return temp.map(item => Object.assign({connectionId:item._id},item.connectionBy._doc))
    },

    receivedRejected: async (parent,{connection},contextValue)  =>
    {
        let temp = await Connection.find({connectionTo: contextValue.user._id , status:"rejected" }).populate("connectionBy")
        return temp.map(item => Object.assign({connectionId:item._id},item.connectionBy._doc))
    },
    receivedPending: async (parent,{connection},contextValue)  => 
    {
        let temp = await Connection.find({connectionTo: contextValue.user._id , status:"pending" }).populate("connectionBy")
 
        return temp.map(item => Object.assign({connectionId:item._id},item.connectionBy._doc) )

    }

}


export const resolvers = {queries, mutations,connectionTypesResolvers}