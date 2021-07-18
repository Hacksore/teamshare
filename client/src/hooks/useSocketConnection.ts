import { useEffect, useRef } from "react";
import io from "socket.io-client";
export const useSocketConnection = () => {

  useEffect(() => {
    // TODO: hardcode - fix later
    const socket = io("http://localhost:8001", {
      path: "/ws",
      transports: ["websocket"]
    });

    socket.on("connect", () => {
      console.log("connected");
    })

  }, []);
};
