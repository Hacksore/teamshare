import { Button, Typography, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import { nanoid } from "nanoid";

export const Home = () => {
  const classes = useStyles();
  const roomId = nanoid();

  return (
    <div className={classes.root}>
      <Typography
        variant="h3"
        classes={{
          root: classes.quoteWrapper,
        }}
      >
        "Simple" screen sharing without the need for any software 😎
      </Typography>

      <div className={classes.buttonWrapper}>
        <Link className={classes.noLink} to="#">
          <Button
            color="primary"
            variant="outlined"
            classes={{
              root: classes.largeButton,
            }}
            disabled
          >
            Join
          </Button>
        </Link>

        <Link className={classes.noLink} to={`/m/${roomId}`}>
          <Button
            color="primary"
            variant="outlined"
            classes={{
              root: classes.largeButton,
            }}
          >
            Host
          </Button>
        </Link>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: any) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "center",
  },
  quoteWrapper: {
    padding: "100px 0 100px 0",
    textAlign: "center",
    width: 700,
  },
  noLink: {
    textDecoration: "none",
  },
  largeButton: {
    textTransform: "none",
    fontSize: 44,
    borderWidth: 4,
    color: theme.palette.primary.contrastText,
    margin: "0 10px 0 10px",
    width: 250,
    height: 100,
  },
}));
