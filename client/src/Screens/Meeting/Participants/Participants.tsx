import { useState } from "react";
import { IconButton, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { lighten } from "@material-ui/core";

const OpenParticipant = ({ name }: { name: string }) => {
  return (
    <div
      style={{
        width: 250,
        height: 150,
        background: "#000",
        margin: "0 4px 0 4px",
        padding: "0 8px 8px 8px",
        fontWeight: "bold",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      {name}
    </div>
  );
};

const ClosedParticipant = ({ name }: { name: string }) => {
  return (
    <div
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
      {name.substring(0, 1)}
    </div>
  );
};

export const Participants = ({ participants }: any) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

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
      {participants.map((p: any, index: number) =>
        open ? (
          <OpenParticipant key={index} name={p} />
        ) : (
          <ClosedParticipant key={index} name={p} />
        )
      )}
    </div>
  );
};

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
