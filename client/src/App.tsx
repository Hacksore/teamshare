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
      // oneway: true // allows you to join and not present
    };

    // try to join
    connection.current.onstream = function (event: any) {
      setBroadcasters((broadcasters: any) => ([
        ...broadcasters,
        {
          id: event.userid,
          stream: event.stream,
          ref: createRef(),
        },
      ]));
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // update the refs
    for (const [index, value] of Object.entries<any>(broadcasters)) {
      broadcasters[index].ref.current.srcObject = value.stream;
    }
  }, [broadcasters]);

  const goLive = () => {
    connection.current.openOrJoin(
      "test",
      (isRoomOpened: boolean, roomid: string, error: any) => {
        console.log(isRoomOpened, roomid, error);
      }
    );
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* Hide our video */}
      <video
        ref={videoRef}
        style={{ display: "none", width: 0, height: 0 }}
        autoPlay
      />

      {broadcasters.map((user: any, index: number) => (
        <>
          <p>{user.id}</p>
          <video
            style={{ width: 300, height: 200 }}
            ref={broadcasters[index].ref}
            autoPlay
          />
        </>
      ))}

      <button onClick={goLive}>GO LIVE</button>
      
    </div>
  );
};

export default App;
