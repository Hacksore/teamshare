import io, { Socket } from "socket.io-client";

let instance: any;

const SOCKET_PORT = "8001";
class SocketService {
  public ws: Socket;

  
  constructor() {    
    this.ws = io(this.getSocketUrl(), {
      path: "/ws",
      transports: ["websocket"]
    });
  }

  getSocketUrl(): string {
    if (process.env.NODE_ENV === "production") {
      const { hostname } = window.location;
      return `https://${hostname}:${SOCKET_PORT}`;
    } else {
      return `http://localhost:${SOCKET_PORT}`;
    }
  }
}


if (!instance) {  
  instance = new SocketService();
}

export default instance;
