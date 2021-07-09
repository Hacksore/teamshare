import { useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/styles";
import Controls from "./Controls";
import Participants from "./Participants";
import { usePeerConnection } from "../../hooks/usePeerConnection";
import { useRecoilState } from "recoil";
import { peersAtom, userSettingsAtom } from "../../state";

export const Meeting = () => {
  const mainVideoRef = useRef<any>(null);
  const classes = useStyles();
  const [userSettings, setUserSettings] = useRecoilState(userSettingsAtom);
  const [peers, setPeers] = useRecoilState<any>(peersAtom);
  const peerRef = useRef<any>(peers);

  const setParticipantStream = ({ id, stream }: any) => {
    setPeers({
      ...peerRef.current,
      [id]: { id, stream },
    });
  };

  const getCurrentLocalVideoRef = () => {
    // @ts-ignore
    return peerRef.current[userSettings.id].stream;
  };

  useEffect(() => {
    peerRef.current = peers;
  }, [peers]);

  // everything will be in global state?
  usePeerConnection({ setParticipantStream, getCurrentLocalVideoRef });

  const handleGoLive = async () => {
    try {
      // @ts-ignore TODO: fix ts error
      const stream = await navigator.mediaDevices.getDisplayMedia();

      // updated peers with my stream
      const updatedPeers = JSON.parse(JSON.stringify(peers));
      if (userSettings.id) {
        updatedPeers[userSettings.id].stream = stream;
        setPeers(updatedPeers);
      }

      setUserSettings({
        ...userSettings,
        isStreaming: true,
        stream: stream,
      });
    } catch (err) {
      console.log(err);
      setUserSettings({
        ...userSettings,
        isStreaming: false,
        stream: undefined,
      });
    }
  };

  return (
    <div>
      <div className={classes.root}>
        <div className={classes.videoRoot}>
          <video ref={mainVideoRef} autoPlay className={classes.video}/>
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
