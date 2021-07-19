import { forwardRef } from "react";
import { makeStyles, IconButton } from "@material-ui/core";

import RecordIcon from "@material-ui/icons/LiveTv";
import ExpandIcon from "@material-ui/icons/Fullscreen";

export const Controls = forwardRef((props: any, ref: any) => {
  const { isSharing, onGoLive } = props;
  const classes = useStyles();

  const handleFullscreen = () => {
    if (ref.current) {
      ref.current.requestFullscreen();
    }
  };

  return (
    <div>
      <IconButton
        classes={{ root: classes.fancyButton }}
        onClick={onGoLive}
        color="secondary"
        disabled={isSharing}
      >
        <RecordIcon />
      </IconButton>

      <IconButton
        classes={{ root: classes.fancyButton }}
        onClick={handleFullscreen}
        color="secondary"
        // startIcon={<ExpandIcon />}
      >
        <ExpandIcon />
      </IconButton>
    </div>
  );
});

const useStyles = makeStyles((theme) => ({
  fancyButton: {
    marginRight: 12
  }
}));
