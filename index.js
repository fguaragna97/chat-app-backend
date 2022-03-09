const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

// creating the server
const server = http.createServer(app);

// creating a new instance of server and using cors to prevent issues
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// using socket io to listen for events when a user connects and disconnects
io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  // listen for the event join room
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID:${socket.id} joined room: ${data}`);
  });

  // we emit from the backend
  socket.on("send_message", (data) => {
    // we only emit to the people in the room with socket.to
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// create the server where our app is running locally
server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
