import path from "path";
import express from "express";
import { ExpressPeerServer } from "@hacksore/peer";
import cors from "cors";
import http from "http";
import e from "express";

// @ts-ignore
const PORT: number = parseInt(process.env.PORT) || 8000;
const app = express();

app.use(cors());
app.use(express.json());

const STATIC_ROOT = path.resolve(__dirname, "../../client/build");
app.use(express.static(STATIC_ROOT));

const rooms = {};

const server = http.createServer(app);
const peerServer: any = ExpressPeerServer(server, {
  allow_discovery: true,
  port: PORT,
  path: "/",
});

app.use("/peerjs", peerServer);

peerServer.on("connection", (client) => {});
peerServer.on("disconnect", (client) => {});

app.get("/peerjs/test", (req: any, res) => {  
  res.send(req.userId);
});

app.post("/peerjs/room", (req: any, res) => {
  // we create room
  const { roomId } = req.body;
  const userId = req.userId;
  const roomExists = rooms[roomId] !== undefined;
  console.log("create room for ", userId);
  
  if (!roomExists) {
    rooms[roomId] = {
      participants: [userId],
    };
  
    res.send({ status: "created room" });
  } else {

    rooms[roomId].participants.push(userId);

    res.send({ status: "room already exists" });
  }
});

app.get("/peerjs/participants/:roomId", (req: any, res) => {  
  const { roomId } = req.params;
  const roomExists = rooms[roomId] !== undefined;
  const userId = req.userId;

  if (!roomExists) {
    res.send({
      participants: [],
      exists: false
    });
  } else {

    // prolly not a good idea
    // rooms[roomId].participants.push(userId);

    res.send({
      participants: rooms[roomId].participants,
      exists: true
    });
  }
 
});

// handle SPA rewrite
app.get("*", (req, res) => res.sendFile(`${STATIC_ROOT}/index.html`));

server.listen(PORT);
