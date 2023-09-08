import express from "express"
import http from "http"
import {Server} from "socket.io"

const app = express();

// create an http server associated with express app
const server = http.createServer(app)
// create an socket server associated with http server
const io = new Server(server)

io.on("connection",(socket) => {
    console.log("a user Connected",socket)
})

const PORT  = process.env.PORT || 3001

server.listen(PORT,(req,res) => console.log("Socket Server Running on Port "+PORT))