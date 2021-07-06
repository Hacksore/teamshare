import http from "http";
import path from "path";
import express from "express";
import RTCMultiConnectionServer from "rtcmulticonnection-server";
import cors from "cors";

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());

const STATIC_ROOT = path.resolve(__dirname, "../../client/build");
app.use(express.static(STATIC_ROOT));

// handle SPA rewrite
app.get("*", (req, res) => res.sendFile(`${STATIC_ROOT}/index.html`));

const server = http.createServer(app);
const io = require("socket.io")(server, { path: "/ws" });

io.on("connection", function (socket) {
  RTCMultiConnectionServer.addSocket(socket);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
