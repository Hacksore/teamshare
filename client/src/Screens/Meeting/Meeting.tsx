import { useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/styles";
import Controls from "./Controls";
import Participants from "./Participants";
import { usePeerConnection } from "../../hooks/usePeerConnection";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  peersAtom,
  peerStreamSetSelector,
  userInfoSelector,
  userSettingsAtom,
} from "../../state";
import SocketService from "../../services/socket";
import { useState } from "react";
import { useCallback } from "react";

export const Meeting = () => {
  const mainVideoRef = useRef<any>(null);
  const classes = useStyles();
  const setUserInfo = useSetRecoilState(userInfoSelector);
  const setPeerStream = useSetRecoilState(peerStreamSetSelector);
  const userInfo = useRecoilValue(userSettingsAtom);
  const [peers, setPeers] = useRecoilState(peersAtom);
  const [isFirstJoin, setIsFirstJoin] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // maybe move this too;
  const peerJS = usePeerConnection();

  const callAllPeers = useCallback((users: any) => {
    // console.log("downastream", peerJS);

    for (const user of users) {
      // console.log("calling peer", user.peerId);
      if (user.peerId === userInfo.peerId) {
        continue; // don't call yourself
      }

      // console.log(peerJS)
      // const call = peerJS.call(user.peerId, new MediaStream());
      // call.on('stream', (remoteStream: any) => {
      //   // Show stream in some video/canvas element.
      //   setPeerStream({
      //     peerId: user.peerId,
      //     stream: remoteStream,
      //   });

      // });
    }
  }, [peerJS, userInfo]);

  const handleRoomUserUpdate = useCallback(
    (users: any) => {
      console.log("users",users);

      if (isFirstJoin) {
        console.log("is first join")
        callAllPeers(users);
        setIsFirstJoin(false);
      }

      setPeers(
        users.map((val: any) => ({
          id: val.id,
          peerId: val.peerId,
          stream: null,
          isStreaming: false,
        }))
      );
    },
    [isFirstJoin]
  );

  // get socket id when we connect
  useEffect(() => {
    // console.log("render", userInfo);

    // already connected do nothing
    if (isConnected) {
      return;
    }

    SocketService.ws.on("connect", () => {
      setIsConnected(true);
      setUserInfo({
        id: SocketService.ws.io.engine.id,
      });
    });

    // add listern for room users
    SocketService.ws.on("list-room-users", handleRoomUserUpdate);

  }, [handleRoomUserUpdate, isConnected]);

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


  const handleGoLive = async () => {
    try {
      // @ts-ignore TODO: fix ts error
      const stream = await navigator.mediaDevices.getDisplayMedia();

      setPeerStream({
        peerId: userInfo.peerId,
        stream: stream,
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
