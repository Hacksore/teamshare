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

    socket.on("offer", (id, description) => {
      const pc = new RTCPeerConnection(STUN_CONFIG);
      setPeerConnections({
        ...peerConnections,
        [id]: {
          id,
          description,
          pc,
        },
      });

      // pc
      //   .setRemoteDescription(description)
      //   .then(() => pc.createAnswer())
      //   .then((sdp) => pc.setLocalDescription(sdp))
      //   .then(() => {
      //     socket.emit("answer", id, pc.localDescription);
      //   });

      // // pc.ontrack = (event) => {
      // //   video.srcObject = event.streams[0];
      // // };

      // pc.onicecandidate = (event) => {
      //   if (event.candidate) {
      //     socket.emit("candidate", id, event.candidate);
      //   }
      // };
    });

    socket.on("answer", (id: string, description: string) => {
      console.log("answer call");
      // peerConnections[id].setRemoteDescription(description);
    });

    socket.on("candidate", (id, candidate) => {
      // console.log("candidate call", id);

      console.log(peerConnections);
      // peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
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
  // useEffect(() => {
  //   // add or remove refs
  //   setVideoRefs((elRefs: any) =>
  //     Array(broadcasters.length)
  //       .fill(0)
  //       .map((_, i) => elRefs[i] || createRef())
  //   );
  // }, [broadcasters]);

  // handle dynamic refs for broacasters
  useEffect(() => {
    for (const [id, val] of Object.entries<any>(peerConnections)) {
      if (!broadcasters.includes(id) && id !== userId) {
        continue;
      }

      // pc.ontrack = (event) => {
      //   video.srcObject = event.streams[0];
      // };

      val.pc.onicecandidate = (event: any) => {
        if (event.candidate) {
          socket.emit("candidate", id, event.candidate);
        }
      };
    }
  }, [peerConnections]);

  const handleWatcher = (id: string) => {
    const pc: any = new RTCPeerConnection(STUN_CONFIG);

    setPeerConnections({
      ...peerConnections,
      [id]: {
        id,
        pc,
      },
    });

    const stream: any = videoRef?.current?.srcObject;
    stream.getTracks().forEach((track: any) => pc.addTrack(track, stream));

    pc.onicecandidate = (event: any) => {
      if (event.candidate) {
        socket.emit("candidate", id, event.candidate);
      }
    };

    pc.createOffer()
      .then((sdp: any) => pc.setLocalDescription(sdp))
      .then(() => {
        socket.emit("offer", id, pc.localDescription);
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
      <button onClick={startStream}>GO LIVE!!!</button>

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
              // ref={videoRefs[index].current}
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
