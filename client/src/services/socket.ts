import io, { Socket } from "socket.io-client";

let instance: any;

class SocketService {
  public ws: Socket;

  constructor() {
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
