import { useEffect, useState } from "react";
import { Drawer, IconButton, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { lighten } from "@material-ui/core";

const OpenParticipant = ({ name }: { name: string }) => {
  return <div style={{ height: 100, width: 100 }}>{name}</div>;
};

const ClosedParticipant = ({ name }: { name: string }) => {
  return (
    <div
      style={{
        height: 48,
        width: 48,
        backgroundColor: "#000",
        borderRadius: 24,
      }}
    >
      {name}
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
        open ? <OpenParticipant name={p} /> : <ClosedParticipant name={p} />
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
  },
  button: {
    margin: theme.spacing(1),
  },
  drawerOpen: {
    height: 200,
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
