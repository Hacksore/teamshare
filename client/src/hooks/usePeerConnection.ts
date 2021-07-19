import { useEffect, useState } from "react";
import Peer from "peerjs";
import { userInfoSelector } from "../state";
import { useSetRecoilState } from "recoil";

// this is prolly ok for a hook now but we need to use this in the meeting
export const usePeerConnection = () => {
  const [peer, setPeer] = useState<any>(null);
  const setUserInfo = useSetRecoilState(userInfoSelector);
  
  useEffect(() => {

    const peer = new Peer({
      // debug: 4,
      host: window.location.hostname,
      port: parseInt(window.location.port),
      path: "/peerjs",
      config: {
        iceServers: [{ urls: "stun:stun1.l.google.com:19302" }],
      },
    });

    peer.on("open", async (id: any) => {
      setUserInfo({ peerId: id });
    });

    // anwser calls
    peer.on("call", async (call: any) => {
      
    });

    // on data connection from remote user
    peer.on("connection", (conn: any) => {
      
    });

    setPeer(peer);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log("peer", peer);
  
  return peer
};
