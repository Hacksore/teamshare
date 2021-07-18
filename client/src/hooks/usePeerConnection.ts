import { useEffect, useRef } from "react";
import Peer from "peerjs";
export const usePeerConnection = ({ setParticipantStream, getCurrentLocalVideoRef }: any) => {
  const peer = useRef<any>(null);

  useEffect(() => {
    // might need to store in ref to use elsewhere
    peer.current = new Peer({
      // debug: 4,
      host: window.location.hostname,
      port: parseInt(window.location.port),
      path: "/peerjs",
      config: {
        iceServers: [{ urls: "stun:stun1.l.google.com:19302" }],
      },
    });

    peer.current.on("open", async (id: any) => {
      console.log(id)
    });

    // anwser calls
    peer.current.on("call", async (call: any) => {
      
    });

    // on data connection from remote user
    peer.current.on("connection", (conn: any) => {
      
    });
  }, []);
};
