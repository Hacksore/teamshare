import express from "express";
import http from "http";

const app = express();
const port = process.env.PORT || 8000;
const server = http.createServer(app);
const io = require("socket.io")(server, {
  path: "/ws"
});

const broadcasters = {};
const clients = {};

/*
EVENTS 

my-id | gives the client who just joined their ID
all-users | gives the client who just joined all the users connected
all-broadcasters | gives the client who just joined all the brodcasters that are live
broadcaster | Someone just started broadcasting
watcher | 

*/

io.sockets.on("error", (e) => console.log(e));
io.sockets.on("connection", (socket) => {

  // when someone connects keep track
  if (!clients[socket.id]) {
    clients[socket.id] = true;

    socket.emit("my-id", socket.id);

    // tell client about broadcasters
    io.emit("all-broadcasters", Object.keys(broadcasters));
    io.emit("all-users", Object.keys(clients));

    // p2p for all of the live broadcasters
    // say hey I want to watch and I am so and so
    for(const [id, value] of Object.entries(broadcasters)) {
      console.log("Telling broadcaster about new p2p");

      if (id !== socket.id) {
        socket.to(id).emit("watcher", socket.id);
      }
    }
  }

  // someone went live
  socket.on("broadcaster", () => {
    broadcasters[socket.id] = true;
    console.log(socket.id, "is going live")
    
    // send bits
    io.emit("broadcaster", socket.id);
    io.emit("all-broadcasters", Object.keys(broadcasters));
  });
  
  socket.on("disconnect", () => {
    io.emit("disconnectPeer", socket.id);
    delete broadcasters[socket.id];
    delete clients[socket.id];
  });

  // someone joined and wants to laod the current broadcaster
  // this seems silly as we already know a user wants to watch from creation
  // socket.on("watcher", () => {
  //   // tell all the users about a new broadcast
  //   for(const [id, value] of Object.entries(broadcasters)) {
  //     socket.broadcast.emit("watcher", socket.id);
  //   }    
  // });

  // STUN/WebRTC relay stuff
  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
  });

  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
  });

  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
  });

});

server.listen(port, () => console.log(`Server is running on port ${port}`));
