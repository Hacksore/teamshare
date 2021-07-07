import { useRef, useState, useEffect, createRef } from "react";


// @ts-ignore
import RTCMultiConnection from "@hacksore/rtcmulticonnection";
import { makeStyles } from "@material-ui/styles";
import { useParams } from "react-router-dom";
import Controls from "./Controls";

const useStyles = makeStyles((theme) => ({
  videoPreview: {
    "& p": {
      margin: 0,
      padding: 0,
    },
  },
  videoPreviewWrap: {
    position: "fixed",
    bottom: 0,
    display: "flex",
    flexDirection: "row",
  },
}));

export const Meeting = () => {
  const videoRef = useRef<any>(null);
  const classes = useStyles();
  const connection = useRef<any>(null);
  const [broadcasters, setBroadcasters] = useState<any>([]);
  const params = useParams<any>();
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    // TODO: figure out the HMR bug here?
    connection.current = new RTCMultiConnection();

    connection.current.socketURL = "/";
    connection.current.socketOptions = {
      path: "/ws",
      transports: ["websocket"],
    };

    connection.current.session = {
      screen: true,
    };

    // try to join
    connection.current.onstream = function (event: any) {
      setBroadcasters((broadcasters: any) => [
        ...broadcasters,
        {
          id: event.userid,
          stream: event.stream,
          ref: createRef(),
        },
      ]);
    };

    // remove users when they leave
    connection.current.onstreamended = function (event: any) {
      setBroadcasters((broadcasters: any) => {
        return broadcasters.filter((item: any) => item.id !== event.userid);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // update the refs
    for (const [index, value] of Object.entries<any>(broadcasters)) {
      broadcasters[index].ref.current.srcObject = value.stream;
    }
  }, [broadcasters]);

  const handleGoLive = () => {
    connection.current.openOrJoin(
      params.id,
      (isRoomOpened: boolean, roomid: string, error: any) => {
        console.log(isRoomOpened, roomid, error);
      }
    );

    setIsSharing(true);
  };

  const handleVideoSelect = (event: any) => {
    videoRef.current.srcObject = event.target.srcObject;
  };

  return (
    <div>
      <div
        style={{
          width: 1200,
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center",
          margin: "0 auto"
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          style={{ background: "#000" }}
        />
        <Controls 
          ref={videoRef}
          isSharing={isSharing}
          onGoLive={handleGoLive}
        />
       
      </div>

      <div className={classes.videoPreviewWrap}>
        {broadcasters.map((user: any, index: number) => (
          <div className={classes.videoPreview}>
            <p>{user.id}</p>
            <video
              onClick={handleVideoSelect}
              style={{ width: 300, height: 200, cursor: "pointer" }}
              ref={broadcasters[index].ref}
              autoPlay
            />
          </div>
        ))}
      </div>
    </div>
  );
};
