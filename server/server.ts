import path from "path";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  path: "/ws",
});

// @ts-ignore
const PORT: number = parseInt(process.env.PORT) || 8000;

app.use(cors());
app.use(express.json());

const STATIC_ROOT = path.resolve(__dirname, "../../client/build");
app.use(express.static(STATIC_ROOT));

// const currentUsers = {};
const rooms = {};

io.on("connection", (socket: any) => {
  const { id: socketId } = socket;

  socket.on("join-room", async (roomId) => {
    console.log("join roomid", roomId);

    // join room
    await socket.join(roomId);

    // tell all users about members
    // @ts-ignore
    const roomUsers = Array.from(io.sockets.adapter.rooms.get(roomId));
    io.to(roomId).emit("list-room-users", roomUsers);

    socket.emit("my-id", socketId);

    // set the room id
    socket.roomId = roomId;
  });

  // when the user disconnects.. perform this
  socket.on("disconnect", async () => {
    await socket.leave(socket.roomId);

    const roomUsers = io.sockets.adapter.rooms.get(socket.roomId);
    if (!roomUsers) {
      return;
    }

    // @ts-ignore
    const roomUsersArray = Array.from(roomUsers);

    // tell users about peple
    io.to(socket.roomId).emit("list-room-users", roomUsersArray);
  });

  // ##############
  /// WEB RTC STUFF
  // ##############

  socket.on("newUserStart", (data) => {
    socket.to(data.to).emit("newUserStart", { sender: data.sender });
  });

  socket.on("sdp", (data) => {
    socket
      .to(data.to)
      .emit("sdp", { description: data.description, sender: data.sender });
  });

  socket.on("ice candidates", (data) => {
    socket
      .to(data.to)
      .emit("ice candidates", {
        candidate: data.candidate,
        sender: data.sender,
      });
  });
});

// handle SPA rewrite
app.get("*", (req, res) => res.sendFile(`${STATIC_ROOT}/index.html`));

server.listen(PORT);
