import { Typography, makeStyles, darken } from "@material-ui/core";
import { Link } from "react-router-dom";
import { userSettingsAtom } from "../../state";
import { useRecoilValue } from "recoil";

export const Header = () => {
  const classes = useStyles();
  const userSettings = useRecoilValue(userSettingsAtom);
  return (
    <div className={classes.root}>
      <Link className={classes.link} to="/">
        <Typography variant="h6" classes={{ root: classes.appName }}>
          TeamShare
        </Typography>
      </Link>

      <div className={classes.userId}>
        <Typography variant="body2" classes={{ root: classes.appName }}>
          {userSettings.id}
        </Typography>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: any) => ({
  root: {
    height: 50,
    width: "100%",
    background: darken(theme.palette.background.default, 0.4),
    display: "flex",
    alignItems: "center",

  },
  appName: {
    marginLeft: 20,
  },
  link: {
    color: theme.palette.primary.contrastText,
    textDecoration: "none",
    flexGrow: 1,
  },
  userId: {
    marginRight: 20
  }
}));
