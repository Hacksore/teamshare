import io, { Socket } from "socket.io-client";

let instance: any;

class SocketService {
  public ws: Socket;

  constructor() {
    console.log("CREATING SOCKET");
    this.ws = io("http://localhost:8001", {
      path: "/ws",
      transports: ["websocket"]
    });
  }
}


if (!instance) {  
  instance = new SocketService();
}

export default instance;
