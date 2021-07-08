import { useEffect, useRef, useState } from "react";
import { IconButton, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { lighten } from "@material-ui/core";
import { useRecoilValue } from "recoil";
import { peersAtom, userSettingsAtom } from  "../../../state";

const OpenParticipant = ({ id, stream, onClick }: { id: string, stream: any, onClick: any }) => {
  const videoRef = useRef<any>(null);
  
  useEffect(() => {
    videoRef.current.srcObject = stream
  }, [stream]);
  
  return (
    <div
      onClick={onClick}
      style={{
        width: 250,
        height: 150,
        background: "#000",
        margin: "0 4px 0 4px",
        padding: "0 8px 8px 8px",
        fontWeight: "bold",
        display: "flex",
        position: "relative",
        // alignItems: "flex-end",
      }}
    >
      <span style={{ zIndex: 1999, position: "absolute", top: 0, left: 0, color: "#fff"}}>{id}</span>
      <video ref={videoRef} autoPlay style={{ background: "#c1c1c1", width: "100%", height: "auto", }} />
    </div>
  );
};

const ClosedParticipant = ({ id, onClick }: { id: string, onClick: any }) => {
  return (
    <div
      onClick={onClick}
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
      {id.substring(0, 1)}
    </div>
  );
};

export const Participants = (props: any) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const peers = useRecoilValue(peersAtom);
  const userSettings = useRecoilValue(userSettingsAtom);
  console.log("my peers are: ", peers)

  const handleStageView = (stream: any) => {    
    props.mainStageRef.current.srcObject = stream;
  }
  
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

      {Object.values(peers).map((p: any, index: number) =>
        open ? (
          <OpenParticipant key={index} id={p.id} stream={p.stream} onClick={() => handleStageView(p.stream)} />
        ) : (
          <ClosedParticipant key={index} id={p.id} onClick={() => handleStageView(p.stream)} />
        )
      )}
    </div>
  );
}

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
