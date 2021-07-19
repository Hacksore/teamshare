import { useEffect, useCallback, useRef, useState, memo } from "react";
import { IconButton, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { lighten } from "@material-ui/core";
import { useRecoilValue } from "recoil";
import { peersAtom } from "../../../state";

const OpenParticipant = memo(
  ({ participant, setStream }: { participant: any; setStream: any }) => {
    const [color, setColor] = useState("");
    const videoRef = useRef<any>(null);

    useEffect(() => {
      const randomColor = Math.floor(Math.random() * 16777215).toString(16);
      setColor(randomColor);
    }, [])


    useEffect(() => {
      if (!videoRef.current) {
        return;
      }
      
      // @ts-ignore
      if (!(participant.stream instanceof MediaStream)) {
        return;
      }

      videoRef.current.srcObject = participant.stream;
    }, [participant.stream]);

    return (
      <div
        onClick={() => setStream(participant.stream)}
        style={{
          width: 250,
          height: 150,
          background: `#${color}`,
          margin: "0 4px 0 4px",
          padding: "8p 8px 8px 8px",
          fontWeight: "bold",
          display: "flex",
          position: "relative",
        }}
      >
        <span
          style={{ zIndex: 1999, position: "absolute", top: 10, left: 10, color: "#fff" }}
        >
          {participant.peerId}
        </span>
        <span
          style={{
            zIndex: 1999,
            position: "absolute",
            bottom: 10,
            left: 10,
            color: "#fff",
          }}
        >
          {participant.id}
        </span>
        <video ref={videoRef} autoPlay style={{ width: "100%", height: "auto" }} />
      </div>
    );
  }
);

const ClosedParticipant = memo(({ participant, setStream }: { participant: any; setStream: any }) => {
  return (
    <div
      onClick={() => setStream(participant.stream)}
      style={{
        height: 48,
        width: 48,
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 24,
        margin: "0 4px 0 4px",
        fontSize: 30,
      }}
    >
      {participant.id.substring(0, 1)}
    </div>
  );
});

export const Participants = memo((props: any) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const peers = useRecoilValue(peersAtom);

  const handleStageView = useCallback((stream: any) => {
    props.mainStageRef.current.srcObject = stream;
  }, []);

  return (
    <div
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
    >
      <div>
        <IconButton className={classes.button} onClick={() => setOpen(!open)}>
          {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
        </IconButton>
      </div>

      {peers &&
        Object.values(peers).map((p: any, index: number) =>
          open ? (
            <OpenParticipant key={p.id} participant={p} setStream={handleStageView} />
          ) : (
            <ClosedParticipant key={p.id} participant={p} setStream={handleStageView} />
          )
        )}
    </div>
  );
});

const useStyles = makeStyles((theme) => ({
  drawer: {
    backgroundColor: lighten(theme.palette.background.default, 0.1),
    borderTop: `1px solid ${lighten(theme.palette.background.default, 0.4)}`,
    display: "flex",
    bottom: 0,
    position: "fixed",
    width: "100%",
    paddingTop: 12,
  },
  button: {
    margin: theme.spacing(1),
  },
  drawerOpen: {
    height: 180,
    transition: theme.transitions.create("height", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("height", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowY: "hidden",
    height: "auto",
  },
}));
