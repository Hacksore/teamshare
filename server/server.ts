import path from "path";
import express from "express";
import { ExpressPeerServer } from "@hacksore/peer";
import { Socket, Server } from "socket.io";
import cors from "cors";
import http from "http";

const app = express();
const server = http.createServer(app);

const socketIo = new Server(server, {
  path: "/ws",
  transports: ["websocket"],
});

const io = socketIo.listen(8001);

// @ts-ignore
const PORT: number = parseInt(process.env.PORT) || 8000;

app.use(cors());
app.use(express.json());

const STATIC_ROOT = path.resolve(__dirname, "../../client/build");
app.use(express.static(STATIC_ROOT));

const peerServer: any = ExpressPeerServer(server, {
  allow_discovery: true,
  port: PORT,
  path: "/",
});

app.use("/peerjs", peerServer);

peerServer.on("connection", () => {});
peerServer.on("disconnect", () => {});

const getRoomList = (roomId: string) => {
  // @ts-ignore
  const currentUsers = Array.from(io.sockets.adapter.rooms.get(roomId));

  return currentUsers.map(id => {
    const socket: any = io.sockets.sockets.get(id);
    // console.log(socket)

    return {
      id: id,
      peerId: socket.peerId
    }
  });
}

io.on("connection", (socket: any) => {

  socket.on("join-room", async ({ roomId, peerId }) => {
    console.log("join roomid", roomId);

    // join room
    await socket.join(roomId);

    // tell all users about members
    // @ts-ignore

    console.log("user joining", roomId, peerId)

    // set the room id
    socket.roomId = roomId;

    // set the peer id
    socket.peerId = peerId;

    io.to(roomId).emit("list-room-users", getRoomList(roomId));

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

});

// handle SPA rewrite
app.get("*", (req, res) => res.sendFile(`${STATIC_ROOT}/index.html`));

server.listen(PORT);
