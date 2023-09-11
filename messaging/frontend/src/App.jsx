import { useEffect, useState } from "react";

import "./App.css";
import  io  from "socket.io-client";

import ChatScreen from "./components/ChatScreen";

const socket = io("http://localhost:3000/",
                  {transports: ['websocket']}
                  );


function App() {
  const [users, setUsers] = useState([
    {
      _id: "64f5a5baf18c226831f93aa7",
      first_name: "Ashish",
      last_name: "KUmar",
    },

    {
      _id: "64fab89d0dcb3b0b64c82874",
      first_name: "Mahesh Kumar",
      last_name: "Kumar",
    },

    {
      _id: "64fab9070dcb3b0b64c82877",
      first_name: "Nishtha",
      last_name: "Jain",
    },

    {
      _id: "64fab91a0dcb3b0b64c8287a",
      first_name: "Saiyam",
      last_name: "Mahajan",
    },

    {
      _id: "64faefd283fe789a8e5f25ae",
      first_name: "Juammdf",
      last_name: "dfdsf",
    },
  ]);

  const [user,setUser] = useState({})
  const [chatUser,setChatUser] = useState({})

  const [messages,setMessages] = useState([
    {
      message: 'HI',
      sender: '64f5a5baf18c226831f93aa7',
      receiver: '64fab9070dcb3b0b64c82877'
    },
    {
      message: 'How',
      sender: '64f5a5baf18c226831f93aa7',
      receiver: '64fab9070dcb3b0b64c82877'
    },
    {
      message: 'Adfd',
      sender: '64f5a5baf18c226831f93aa7',
      receiver: '64fab9070dcb3b0b64c82877'
    },
    {
      message: 'df',
      sender: '64f5a5baf18c226831f93aa7',
      receiver: '64fab9070dcb3b0b64c82877'
    }
  ])

  const sendMessage = (message) => {

    socket.emit("add-message", {
      message: message,
      sender: user._id,
      receiver: chatUser._id
    })
  }

  useEffect(() => {
    socket.on("message-received",(data) => {
      alert(data.message)
    })
  },[])


  return (
   <div className="container p-5">
      <div className="row">
          <div className="col col-3">
                <h3>Friends</h3>
                <input type="text" onChange={(e) => setUser( users[parseInt(e.currentTarget.value)]) } />
                
                {users.map((item,idex) =>  <p onClick={() => setChatUser(item) } className='text-sm muted'>{item.first_name}</p> )}
          </div>
          <div className="col col-9 ">
            <ChatScreen user={user} chatUser={chatUser} sendMessage={sendMessage} messages={messages} />
          </div>
      </div>
      
   </div>
  );
}

export default App;
