import io from "socket.io-client";

// const STUN_CONFIG = {
//   iceServers: [
//     { 
//       "urls": "stun:stun.l.google.com:19302",
//     },
//   ]
// };

class SocketService { 

  private peerConnections: any = {};
  public ws;

  constructor() {
    this.ws = io("/", {
      path: "/ws",
      transports: ["websocket"]
    });

    // this.ws.on("answer", this.answer.bind(this));

  }
  
  // answer(id: string, description: string) {   
  //   this.peerConnections[id].setRemoteDescription(description);
  // }

  // socket.on("watcher", id => {
  //   const peerConnection = new RTCPeerConnection(config);
  //   peerConnections[id] = peerConnection;

  //   // const stream = videoRef.current.srcObject;
  //   // stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

  //   peerConnection.onicecandidate = event => {
  //     if (event.candidate) {
  //       socket.emit("candidate", id, event.candidate);
  //     }
  //   };

  //   peerConnection
  //     .createOffer()
  //     .then(sdp => peerConnection.setLocalDescription(sdp))
  //     .then(() => {
  //       socket.emit("offer", id, peerConnection.localDescription);
  //     });
  // });

  // socket.on("candidate", (id, candidate) => {
  //   peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
  // });

  // socket.on("disconnectPeer", id => {
  //   peerConnections[id].close();
  //   delete peerConnections[id];
  // });

}

let socketInstance: SocketService = new SocketService();

if (socketInstance == null) {
  socketInstance = new SocketService();
}

export default socketInstance;
