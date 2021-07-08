
// import Peer from "peerjs";
// // import { createRoom, getRoomParticipants } from "../services/room";

// let instance: any;

// class PeerService {

//   public peer: Peer;

//   constructor () {

//     // create peer instance
//     this.peer = new Peer({
//       // debug: 4,
//       host: window.location.hostname,
//       port: parseInt(window.location.port),
//       path: "/peerjs",
//       config: {
//         iceServers: [{ urls: "stun:stun1.l.google.com:19302" }],
//       },
//     });

//     // handlers
//     this.peer.on("open", this.onConnect.bind(this))
//   }

//   /**
//    * When connected to the peerJS backend server
//    * @param id 
//    */
//   onConnect(id: string) {

//   }

//     // peer.on("open", async (id) => {
//     //   // save id from server locally
//     //   setUserId(id);

//     //   const response = await getRoomParticipants(params.id);
//     //   console.log("room participants", response.participants);
//     //   setPeers(response.participants);

//     //   if (!response.exists) {
//     //     // create the room
//     //     await createRoom(params.id);
//     //   }

//     //   // TODO: all the broadcasters have to start teh call to the viewers
//     //   // call all peers
//     //   for (const peerId of response.participants) {
//     //     if (id === peerId) {
//     //       return // dont call yourself
//     //     }
        
//     //     console.log("start data channel", peerId);
//     //     const conn = peer.connect(peerId);
//     //     conn.on("open", () => {
//     //       conn.send("p2p data");
//     //     });

//     //     conn.on("data", (data: any) => {
//     //       console.log("client ack", data);          
//     //       // peer.call(peerId, stream);

//     //     })
//     //   }
//     // });

//     // // anwser calls
//     // peer.on("call", async (call) => {
//     //   console.log("getting a call rn");

//     //   // @ts-ignore
//     //   // TODO: if we are streaming chuck in the media
//     //   call.answer();

//     //   //
//     //   call.on("stream", (remoteStream) => {
//     //     console.log("got a remote stream");
//     //     videoRef.current.srcObject = remoteStream;
//     //   });
//     // });

//     // // on connection
//     // peer.on("connection", (conn: any) => {
//     //   conn.on("data", (data: any) => {
//     //     console.log("data stream opened");
//     //     // add new user to peers
//     //     setPeers(currentPeers => [
//     //       ...currentPeers,
//     //       conn.peer
//     //     ]);

//     //     if (isStreaming.current) {
//     //       console.log("I need to call this new client", conn);
//     //       peer.call(conn.peer, videoRef.current.srcObject);
//     //     }
//     //   });

//     //   conn.on("open", () => {
//     //     conn.send("hello!");
//     //   });
//     // });

//     // userRef.current = peer;

// }

// if (!instance) {
//   instance = new PeerService();
// }

// export default instance;
export {}