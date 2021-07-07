import { useRef, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { TextField } from "@material-ui/core";
import Controls from "./Controls";
import Peer from "peerjs";
import { Participants } from "./Participants";

export const Meeting = () => {
  const videoRef = useRef<any>(null);
  const userRef = useRef<any>(null);
  const classes = useStyles();
  const [userId, setUserId] = useState<string | null>(null);
  const [peers, setPeers] = useState<string[]>([]);

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

    peer.on("open", (id) => {
      // save id from server locally
      setUserId(id);

      // atemp to call users in the room without any media
      peer.listAllPeers((currentPeers) => {
        console.log("current users", peers);
        setPeers(currentPeers);
      });
    });

    // anwser calls
    peer.on("call", (call) => {
      call.answer();
      call.on("stream", (remoteStream) => {});
    });

    // on connection
    peer.on("connection", (conn: any) => {
      console.log("got connection");
    });

    userRef.current = peer;
  }, []);

  const handleGoLive = () => {
    peers.forEach(peer => {
      console.log(peer);
      if (userId !== peer) userRef.current.connect(peer);
    })
  };

  return (
    <div>
      <TextField id="userid" label="Username" defaultValue={userId} style={{ width: 300, margin: 8 }} />
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
      <Participants participants={["alex o", "jack", "sean b"]}/>
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
