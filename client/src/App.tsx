import { useRef, useState, useEffect, createRef } from "react";

// @ts-ignore
import RTCMultiConnection from "@hacksore/rtcmulticonnection";

const App = () => {
  const videoRef = useRef(null);
  const connection = useRef<any>(null);
  const [broadcasters, setBroadcasters] = useState<any>([]);

  useEffect(() => {
    // TODO: figure out the HMR bug here?
    connection.current = new RTCMultiConnection();

    connection.current.socketURL = "/";
    connection.current.socketOptions = {
      path: "/ws",
      transports: ["websocket"],
    };

    connection.current.session = {
      screen: true,
    };

    // try to join
    connection.current.onstream = handleNewStream;
  }, []);

  useEffect(() => {
    // update the refs
    for (const [index, value] of Object.entries(broadcasters)) {
      // @ts-ignore
      broadcasters[index].ref.current.srcObject = value.stream;
    }
  }, [broadcasters]);

  const handleNewStream = (event: any) => {
    setBroadcasters([
      ...broadcasters,
      {
        id: event.userid,
        stream: event.stream,
        ref: createRef(),
      },
    ]);
  };

  const goLive = () => {
    connection.current.openOrJoin(
      "test",
      (isRoomOpened: boolean, roomid: string, error: any) => {
        console.log(isRoomOpened, roomid, error);
      }
    );
  };

  console.log(broadcasters);

  return (
    <div>
      {/* Hide our video */}
      <video
        ref={videoRef}
        style={{ display: "none", width: 0, height: 0 }}
        autoPlay
      />

      {broadcasters.map((user: any, index: number) => (
        <video
          style={{ width: "100%", height: "100%" }}
          ref={broadcasters[index].ref}
          autoPlay
          controls
        />
      ))}

      <button onClick={goLive}>GO LIVE</button>
    </div>
  );
};

export default App;
