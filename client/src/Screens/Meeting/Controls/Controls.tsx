import { forwardRef } from "react";
import { Button } from "@material-ui/core";
import RecordIcon from "@material-ui/icons/LiveTv";
import ExpandIcon from "@material-ui/icons/Fullscreen";

export const Controls = forwardRef((props: any, ref: any) => {
  const { isSharing, onGoLive } = props;

  const handleFullscreen = () => {
    if (ref.current) {
      ref.current.requestFullscreen();
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={onGoLive}
        color="primary"
        disabled={isSharing}
        startIcon={<RecordIcon />}
      >
        Share Screen
      </Button>

      <Button
        onClick={handleFullscreen}
        variant="contained"
        color="primary"
        startIcon={<ExpandIcon />}
      >
        Fullscreen
      </Button>
    </div>
  );
});
