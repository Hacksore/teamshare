import path from "path";
import express from "express";
import { ExpressPeerServer } from "@hacksore/peer";
import cors from "cors";
import http from "http";

// @ts-ignore
const PORT: number = parseInt(process.env.PORT) || 8000;
const app = express();

app.use(cors());
app.use(express.json());

const STATIC_ROOT = path.resolve(__dirname, "../../client/build");
app.use(express.static(STATIC_ROOT));

const rooms = {
  "test": {
    "participants": {
      "ayylmao": true
    }
  }
};

const server = http.createServer(app);
const peerServer: any = ExpressPeerServer(server, {
  allow_discovery: true,
  port: PORT,
  path: "/",
});

app.use("/peerjs", peerServer);

peerServer.on("connection", (client) => {

});

peerServer.on("disconnect", (client) => {

  for (const [roomId, value] of Object.entries<any>(rooms)) {
    delete rooms[roomId].participants[client.id];
    // client.socket.emit()
  }
  
});

app.get("/peerjs/test", (req: any, res) => {  
  res.send(req.userId);
});

// we create room
app.post("/peerjs/room", (req: any, res) => {
  const { roomId } = req.body;
  const userId = req.userId;
  const roomExists = rooms[roomId] !== undefined;
  console.log("create room for", userId);
  
  if (!roomExists) {
    rooms[roomId] = {
      participants: {
        [userId]: true
      },
    };
  
    res.send({ status: "created room" });
  } else {

    // why are we adding here?
    // rooms[roomId].participants = {
    //   ...rooms[roomId].participants,
    //   [userId]: true
    // };

    res.send({ status: "room already exists" });
  }
});

//join room
app.put("/peerjs/room", (req: any, res) => {
  const { roomId } = req.body;
  const userId = req.userId;
  const roomExists = rooms[roomId] !== undefined;
  
  if (roomExists) {
    if (rooms[roomId].participants[userId]) {
      return res.send({ status: "already in room" });
    }

    // add user
    rooms[roomId].participants = {
      ...rooms[roomId].participants,
      [userId]: true
    }; 
    res.send({ status: "joined room" });

  } else {
    res.send({ status: "room is not avail" });
  }
});

app.get("/peerjs/participants/:roomId", (req: any, res) => {  
  const { roomId } = req.params;
  const roomExists = rooms[roomId] !== undefined;
  const userId = req.userId;

  if (!roomExists) {
    res.send({
      participants: {
        [userId]: true
      },
      exists: false
    });
  } else {
    res.send({
      participants: rooms[roomId].participants,
      exists: true
    });
  }
 
});

// handle SPA rewrite
app.get("*", (req, res) => res.sendFile(`${STATIC_ROOT}/index.html`));

server.listen(PORT);
