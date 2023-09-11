import React from 'react'
import { useState } from 'react'

export default function ChatScreen({user,chatUser,sendMessage,messages}) {
  const [m,setM] = useState("")

  const sender = {float:"right"}
  return (

    <div>
      <p>Current User: {user && user.first_name} </p>

     
      <div style={{border: "1px solid grey", height:"700px",overflow:"scroll",position:"relative"}}>
        <p className='p-3'>Chatting With: {chatUser && chatUser.first_name}</p>

        {messages.map( (message) =>{ 
         

          return  <p className={message.sender == user._id ? "sender p-2" : "receiver p-2"} > {message.message}</p>
          } )
        }


        <div  style={{position:"absolute",bottom:"20px",width:"80%",margin:"20px"}}>
        <input onChange={(e) => setM(e.currentTarget.value) } placeholder="Enter Message" />
        <button onClick={() => sendMessage(m)}>Send</button>
        </div>
          
      </div>
    </div>
  )
}
