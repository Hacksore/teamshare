import path from "path";
import express from "express";
import { ExpressPeerServer } from "peer";
import cors from "cors";
import http from "http";

// @ts-ignore
const PORT: number = parseInt(process.env.PORT) || 8000;
const app = express();

app.use(cors());

const STATIC_ROOT = path.resolve(__dirname, "../../client/build");
app.use(express.static(STATIC_ROOT));

const server = http.createServer(app);
const peerServer = ExpressPeerServer(server, {
  // @ts-ignore
  debug: true,
  allow_discovery: true,
  port: PORT,
  path: "/",
});

app.use("/peerjs", peerServer);

peerServer.on('connection', (client) => { 
  // console.log(client);
});

peerServer.on('disconnect', (client) => { 
  // console.log(client);
});

// handle SPA rewrite
app.get("*", (req, res) => res.sendFile(`${STATIC_ROOT}/index.html`));

server.listen(PORT);
