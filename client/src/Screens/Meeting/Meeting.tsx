import { useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/styles";
import Controls from "./Controls";
import Participants from "./Participants";
import { usePeerConnection } from "../../hooks/usePeerConnection";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  peersAtom,
  peerStreamSetSelector,
  userInfoSelector,
  userSettingsAtom,
} from "../../state";
import SocketService from "../../services/socket";
import { useHandleRoomUsers } from "../../hooks/useHandleRoomUsers";

export const Meeting = () => {
  const mainVideoRef = useRef<any>(null);
  const classes = useStyles();
  const setUserInfo = useSetRecoilState(userInfoSelector);
  const setPeerStream = useSetRecoilState(peerStreamSetSelector);
  const userInfo = useRecoilValue(userSettingsAtom);
  const peers = useRecoilValue(peersAtom);

  const peerJS = usePeerConnection();
  const { callAllPeers, handleRoomUserUpdate } = useHandleRoomUsers(peerJS);

  // get socket id when we connect
  useEffect(() => {
    SocketService.ws.on("connect", () => {

    });

    SocketService.ws.on("my-id", (id: string) => {
      setUserInfo({
        id,
      });
    });

    // add listern for room users
    SocketService.ws.on("list-room-users", (users: any) => {
      handleRoomUserUpdate(users);    
    });

    return () => {
      SocketService.ws.off("list-room-users")
    };

  }, [handleRoomUserUpdate]);

  // when we have a peer id join the room
  useEffect(() => {
    if (!userInfo.peerId) {
      return;
    }

    SocketService.ws.emit("join-room", {
      roomId: "test",
      peerId: userInfo.peerId,
    });
  }, [userInfo.peerId]);

  // call all users
  useEffect(() => {
    callAllPeers(peers);
  }, [userInfo.stream]);

  const handleGoLive = async () => {
    try {
      // @ts-ignore TODO: fix ts error
      const stream = await navigator.mediaDevices.getDisplayMedia();

      // go live see screen
      setPeerStream({
        peerId: userInfo.peerId,
        stream: stream,
      });

      // set it in the local users state
      setUserInfo({
        stream: stream,
        isStreaming: true,
      });


    } catch (err) {}
  };

  return (
    <div>
      <div className={classes.root}>
        <div className={classes.videoRoot}>
          <video ref={mainVideoRef} autoPlay className={classes.video} />
          <div className={classes.videoControls}>
            <Controls
              ref={mainVideoRef}
              isSharing={false}
              onGoLive={handleGoLive}
            />
          </div>
        </div>
      </div>

      <Participants mainStageRef={mainVideoRef} />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: 1200,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    margin: "0 auto",
  },
  videoPreview: {
    "& p": {
      margin: 0,
      padding: 0,
    },
  },
  video: {
    width: 1200,
    background: "#000",
  },
  videoPreviewWrap: {
    position: "fixed",
    bottom: 0,
    display: "flex",
    flexDirection: "row",
  },
  videoRoot: {
    position: "relative",
  },
  videoControls: {
    bottom: 0,
    left: 0,
    position: "absolute",
  },
}));
