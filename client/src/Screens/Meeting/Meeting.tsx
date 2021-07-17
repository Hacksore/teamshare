import { useRef } from "react";
import { makeStyles } from "@material-ui/styles";
import Controls from "./Controls";
import Participants from "./Participants";
import { useRecoilState } from "recoil";
import { peersAtom, userSettingsAtom } from "../../state";
import { useSocketConnection } from "../../hooks/useSocketConnection";

export const Meeting = () => {
  const mainVideoRef = useRef<any>(null);
  const classes = useStyles();
  const [userSettings, setUserSettings] = useRecoilState(userSettingsAtom);
  const { userId } = useSocketConnection();


  const handleGoLive = async () => {
    try {
      // @ts-ignore TODO: fix ts error
      const stream = await navigator.mediaDevices.getDisplayMedia();
    } catch (err) {}
  };

  return (
    <div>
      <div className={classes.root}>
        {userId}
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
