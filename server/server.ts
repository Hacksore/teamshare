import express from "express";
import http from "http";
const app = express();
const port = process.env.PORT || 8000;
const server = http.createServer(app);
const io = require("socket.io")(server, {
  path: "/ws"
});

// app.use(express.static(__dirname + "/public"));
const broadcasters = {};
const clients = {};

io.sockets.on("error", (e) => console.log(e));
io.sockets.on("connection", (socket) => {

  // when someone connects keep track
  if (!clients[socket.id]) {
    clients[socket.id] = true;

    socket.emit("my-id", socket.id);

    console.log(socket.id, "joined")
    // tell everyone else I joined
    socket.broadcast.emit("new-user", socket.id);
  }

  // someone went live
  socket.on("broadcaster", () => {
    broadcasters[socket.id] = true;
    console.log(socket.id, "is going live")
    socket.broadcast.emit("broadcaster");
  });
  
  // someone joined and wants to laod the current broadcaster
  socket.on("watcher", () => {
    // tell all the users about a new broadcast
    for(const [id, value] of Object.entries(broadcasters)) {
      socket.to(id).emit("watcher", socket.id);
    }    
  });

  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
  });

  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
  });

  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
  });

  socket.on("disconnect", () => {
    // remove the id from broadcasters if found
    // if () {

    // }

    // socket.to(broadcaster).emit("disconnectPeer", socket.id);
  });

});

server.listen(port, () => console.log(`Server is running on port ${port}`));
