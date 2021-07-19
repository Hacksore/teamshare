import path from "path";
import express from "express";
import { ExpressPeerServer } from "peer";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";

const PEERJS_PORT = 8000
const SOCKETIO_PORT = 8001

const app = express();
const server = http.createServer(app);

const socketIo = new Server(server, {
  path: "/ws",
  transports: ["websocket"],
});

const io = socketIo.listen(SOCKETIO_PORT);

app.use(cors());
app.use(express.json());

const STATIC_ROOT = path.resolve(__dirname, "../../client/build");
app.use(express.static(STATIC_ROOT));

const peerServer: any = ExpressPeerServer(server, {
  allow_discovery: true,
  port: PEERJS_PORT,
  path: "/",
});

app.use("/peerjs", peerServer);

peerServer.on("connection", () => {});
peerServer.on("disconnect", () => {});

const getRoomList = (roomId: string) => {
  // @ts-ignore
  const roomIds = io.sockets.adapter.rooms.get(roomId);
  if (!roomIds) {
    return [];
  }

  const currentUsers = Array.from(roomIds);

  if (!currentUsers) {
    return [];
  }

  return currentUsers.map(id => {
    const socket: any = io.sockets.sockets.get(id);

    return {
      id: id,
      peerId: socket.peerId
    }
  });
}

io.on("connection", (socket: any) => {
  // send id
  socket.emit("my-id", socket.id);
  socket.on("join-room", async ({ roomId, peerId }) => {
    console.log("join roomid", roomId);

    // join room
    socket.join(roomId);

    // tell all users about members
    // @ts-ignore

    // console.log("user joining", roomId, peerId)

    // set the room id
    socket.roomId = roomId;

    // set the peer id
    socket.peerId = peerId;

    io.to(roomId).emit("list-room-users", getRoomList(roomId));

  });

  // when the user disconnects.. perform this
  socket.on("disconnect", async () => {
    socket.leave(socket.roomId);

    const roomUsers = getRoomList(socket.roomId);
    if (!roomUsers) {
      return;
    }

    // tell users about peple
    io.to(socket.roomId).emit("list-room-users", roomUsers);
  });

});

// handle SPA rewrite
app.get("*", (req, res) => res.sendFile(`${STATIC_ROOT}/index.html`));

server.listen(PEERJS_PORT);
