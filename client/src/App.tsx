import { useEffect, useRef, useState } from "react";
import SocketService from "./socket";

const App = () => {
  const videoRef = useRef(null);
  const [broadcasters, setBroadcasters] = useState([]);
  
  useEffect(() => {
    // sonone went live
    SocketService.ws.on("broadcaster", () => {
      console.log("hi");
    });
  }, []);

  const startStream = async () => {
    if (!videoRef) {
      return;
    }

    // @ts-ignore
    const stream = await navigator.mediaDevices.getDisplayMedia();
    console.log(stream, videoRef.current);

    // @ts-ignore
    videoRef.current.srcObject = stream;
    SocketService.ws.emit("broadcaster");

    return stream;
  };

  return (
    <>
      <video ref={videoRef} style={{ width: 700, height: 800 }} autoPlay />
      <button onClick={startStream}>Start</button>
    </>
  );
};

export default App;
