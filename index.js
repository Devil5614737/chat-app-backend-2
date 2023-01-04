const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const app = express();
const DB = require("./database/Db");
const login = require("./routes/login");
const signup = require("./routes/signup");
const users = require("./routes/users");
const chat = require("./routes/chat");
const message = require("./routes/message");
const mongoose=require('mongoose')

dotenv.config({ path: "./.env" });

app.use(cors());
app.use(express.json());

// Initializing  Database
mongoose.set('strictQuery', true);
DB();

// routes
app.use("/api", login);
app.use("/api", signup);
app.use("/api", users);
app.use("/api", chat);
app.use("/api", message);

const PORT = 4000;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://merry-madeleine-8c62a1.netlify.app",
    // origin: "https://63a1dc63ff32ad145decc31c--thriving-kheer-a9feab.netlify.app",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData?._id);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    console.log(newMessageRecieved)
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
        socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
  

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
