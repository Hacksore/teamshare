import { useEffect, createRef, useRef, useState } from "react";
import Broadcasters from "./Components/Broadcasters";
import Participants from "./Components/Participants";
import SocketService from "./socket";

const STUN_CONFIG = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

const App = () => {
  const videoRef = useRef<any>(null);
  const [broadcasters, setBroadcasters] = useState<any>([]);
  const [participants, setParticipants] = useState<any>([]);
  const [userId, setUserId] = useState(null);
  const [peerConnections, setPeerConnections] = useState<any>({});
  const [videoRefs, setVideoRefs] = useState<any>([]);
  const socket = SocketService.ws;

  useEffect(() => {
    // someone went live
    socket.on("broadcaster", (broadcastId) => {
      setBroadcasters([...broadcasters, broadcastId]);
    });

    // get current broadcasters
    socket.on("all-users", (allUsers) => {
      setParticipants(allUsers);
    });

    socket.on("all-broadcasters", (allBroadcasterIds) => {
      setBroadcasters(allBroadcasterIds);
    });

    // my id
    socket.on("my-id", (id) => {
      setUserId(id);
    });

    // tell server im ready for stuff
    // socket.on("connect", () => {
    //   socket.emit("watcher");
    // });

    socket.on("answer", (id: string, description: string) => {
      peerConnections[id].setRemoteDescription(description);
    });

    socket.on("candidate", (id, candidate) => {
      peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("disconnectPeer", (id) => {
      const updatedPeerConnections = { ...peerConnections };
      delete updatedPeerConnections[id];
      setPeerConnections(updatedPeerConnections);
    });

    // handle watchers
    socket.on("watcher", handleWatcher);
  }, []);

  // handle dynamic refs for broacasters
  useEffect(() => {
    // add or remove refs
    setVideoRefs((elRefs: any) =>
      Array(broadcasters.length)
        .fill(0)
        .map((_, i) => elRefs[i] || createRef())
    );
  }, [broadcasters]);

  // handle dynamic refs for broacasters
  useEffect(() => {
    console.log(peerConnections)
  }, [peerConnections]);

  const handleWatcher = (id: string) => {
    const peerConnection: any = new RTCPeerConnection(STUN_CONFIG);

    setPeerConnections({
      ...peerConnections,
      [id]: peerConnection,
    });

    const stream: any = videoRef?.current?.srcObject;
    stream
      .getTracks()
      .forEach((track: any) => peerConnection.addTrack(track, stream));

    peerConnection.onicecandidate = (event: any) => {

      if (event.candidate) {
        console.log("onicecandidate", id, event);
        socket.emit("candidate", id, event.candidate);
      }
    };

    peerConnection
      .createOffer()
      .then((sdp: any) => peerConnection.setLocalDescription(sdp))
      .then(() => {
        // console.log("Created offer", id, peerConnection.localDescription);
        socket.emit("offer", id, peerConnection.localDescription);
      });
  };

  const startStream = async () => {
    if (!videoRef) {
      return;
    }

    // @ts-ignore
    const stream = await navigator.mediaDevices.getDisplayMedia();
    // console.log(stream, videoRef.current);

    // @ts-ignore
    videoRef.current.srcObject = stream;
    socket.emit("broadcaster");

    return stream;
  };

  return (
    <>
      <button onClick={startStream}>Start</button>

      <Broadcasters broadcasters={broadcasters} />
      <Participants participants={participants} />
      <div style={{ position: "fixed", top: 0, right: 0 }}>{userId}</div>

      <video ref={videoRef} style={{ width: 200, height: 100 }} autoPlay />

      {broadcasters
        .filter((id: string) => id !== userId) // don't show your own video
        .map((id: string, index: string) => (
          <div key={id}>
            <p>{id}</p>
            <video
              // ref={videoRefs.current[index]}
              autoPlay
              style={{
                width: 200,
                height: 100,
                background: "#000",
              }}
            />
          </div>
        ))}
    </>
  );
};

export default App;
