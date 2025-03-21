const express = require("express")
const { Server } = require("socket.io")
const bodyParser = require("body-parser")

const io = new Server()
const app = express()

const expressPort = process.env.EXPRESS_PORT || 8000
const ioPort = process.env.IO_PORT || 8001

app.use(bodyParser.json());

io.on("connection", (socket) => {
    
});

app.listen(expressPort, () => {
  console.log("Express server is running on port 8000")
})

io.listen(ioPort, () => {
  console.log("Express server is running on port 8000")
})