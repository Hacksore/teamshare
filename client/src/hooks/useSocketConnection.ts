import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useRecoilState, useSetRecoilState } from "recoil";
import { peersAtom } from "../state";

export const useSocketConnection = () => {
  const [peers, setPeers] = useRecoilState(peersAtom);
  const [userId, setUserId] = useState();

  useEffect(() => {
    for (const [k, v] of Object.entries(peers)) { 
      // .addIceCandidate( new RTCIceCandidate( data.candidate ) 
    }
  }, peers);

  useEffect(() => {
    console.log(window.location.origin);
    const socket = io(window.location.origin, {
      path: "/ws",
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      socket.emit("join-room", "test");
    });

    socket.on("my-id", (socketId) => {
      setUserId(socketId);
    });

    socket.on("list-room-users", (users) => {
      const usersInRoom = users.map((id: string) => ({
        id,
        connection: new RTCPeerConnection({
          iceServers: [
            {
              urls: "stun:stun.l.google.com:19302",
            },
          ],
        }),
      }));

      // set what the server tolds us
      setPeers(usersInRoom);
    });

    socket.on("user-joined", (userId) => {
      console.log("new user", userId);
    });

    socket.on("user-leave", (userId) => {
      console.log("user left", userId);
    });

    /// ##########
    // WEB RTC logic
    /// #######
    socket.on("sdp", async (data) => {
      if (data.description.type === "offer") {
        
      }
    });

    socket.on("ice candidates", async (data) => {
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { userId };
};
