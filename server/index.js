const express = require("express")
const { Server } = require("socket.io")
const bodyParser = require("body-parser")

const io = new Server({
  cors: true
})

const app = express()

const expressPort = process.env.EXPRESS_PORT || 8000
const ioPort = process.env.IO_PORT || 8001

app.use(bodyParser.json());

const emailToSocketMapping = new Map()
const socketToEmailMapping = new Map()

io.on("connection", (socket) => {
  socket.on("join-room", (data) => {
    const { emailId, roomId } = data
    emailToSocketMapping.set(emailId, socket.id);
    socketToEmailMapping.set(socket.id, emailId);
    socket.join(roomId)

    console.log(`User: ${emailId} JoinedRoom: ${roomId}`);

    socket.emit('joined-room', { roomId })
    socket.broadcast.to(roomId).emit("user-joined", { emailId })
  })

  socket.on("call-user", (data) => {
    const { emailId, offer } = data
    const fromEmail = socketToEmailMapping.get(socket.id)
    const socketId = emailToSocketMapping.get(emailId)
    socket.to(socketId).emit('incomming-call', { from: fromEmail, offer })
  })

  socket.on('call-accepted', (data) => {
    const { emailId, ans } = data
    const socketId = emailToSocketMapping.get(emailId);
    socket.to(socketId).emit('call-accepted', { ans })
  })
});

app.listen(expressPort, () => {
  console.log("Express server is running on port 8000")
})

io.listen(ioPort, () => {
  console.log("Express server is running on port 8000")
})