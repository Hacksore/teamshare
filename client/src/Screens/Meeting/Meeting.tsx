import { useRef, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import Controls from "./Controls";
import Peer from "peerjs";
import Participants from "./Participants";
import { useParams } from "react-router-dom";
import { createRoom, getRoomParticipants } from "../../services/room";

// TODO: figureout how to do rooms as they are required

export const Meeting = () => {
  const videoRef = useRef<any>(null);
  const userRef = useRef<any>(null);
  const classes = useStyles();
  const [userId, setUserId] = useState<string | null>(null);
  const [peers, setPeers] = useState<string[]>([]);


  // const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const isStreaming: any = useRef();

  const params: any = useParams();

  useEffect(() => {
    // might need to store in ref to use elsewhere
    const peer = new Peer({
      // debug: 4,
      host: window.location.hostname,
      port: parseInt(window.location.port),
      path: "/peerjs",
      config: {
        iceServers: [{ urls: "stun:stun1.l.google.com:19302" }],
      },
    });

    peer.on("open", async (id) => {
      // save id from server locally
      setUserId(id);

      const response = await getRoomParticipants(params.id);
      console.log("room participants", response.participants);
      setPeers(response.participants);

      if (!response.exists) {
        // create the room
        await createRoom(params.id);
      }

      // TODO: all the broadcasters have to start teh call to the viewers
      // call all peers
      for (const peerId of response.participants) {
        if (id === peerId) {
          return // dont call yourself
        }
        
        console.log("start data channel", peerId);
        const conn = peer.connect(peerId);
        conn.on("open", () => {
          conn.send("streaming");
        });

        conn.on("data", (data: any) => {
          console.log("client ack", data);          
          // peer.call(peerId, stream);

        })
      }
    });

    // anwser calls
    peer.on("call", async (call) => {
      console.log("getting a call rn");

      // @ts-ignore
      call.answer();

      //
      call.on("stream", (remoteStream) => {
        console.log("got a remote stream");
        videoRef.current.srcObject = remoteStream;
      });
    });

    // on connection
    peer.on("connection", (conn: any) => {
      conn.on("data", (data: any) => {
        console.log("data stream opened");
        if (isStreaming.current) {
          console.log("I need to call this new client", conn);
          peer.call(conn.peer, videoRef.current.srcObject);
        }
      });

      conn.on("open", () => {
        conn.send("hello!");
      });
    });

    userRef.current = peer;
  }, []);


  const handleGoLive = async () => {
    try {
      // @ts-ignore
      const stream = await navigator.mediaDevices.getDisplayMedia();
      videoRef.current.srcObject = stream;
    
      isStreaming.current = true;
    } catch {
      isStreaming.current = false;
    }
  };

  return (
    <div>
      {userId}
      <div
        style={{
          width: 1200,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          margin: "0 auto",
        }}
      >
        <video ref={videoRef} autoPlay style={{ background: "#000" }} />
        <Controls ref={videoRef} isSharing={false} onGoLive={handleGoLive} />
      </div>

      <Participants participants={["Alex O", "Jack B", "Sean b"]} />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  videoPreview: {
    "& p": {
      margin: 0,
      padding: 0,
    },
  },
  videoPreviewWrap: {
    position: "fixed",
    bottom: 0,
    display: "flex",
    flexDirection: "row",
  },
}));
