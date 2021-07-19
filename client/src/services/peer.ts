import Peer from "peerjs";

let instance: any;

class PeerService {
  public peer: any;

  constructor() {
    this.peer = new Peer({
      // debug: 4,
      host: window.location.hostname,
      port: parseInt(window.location.port),
      path: "/peerjs",
      config: {
        iceServers: [{ urls: "stun:stun1.l.google.com:19302" }],
      },
    });
  }
}

if (!instance) {  
  instance = new PeerService();
}

export default instance;
