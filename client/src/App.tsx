import { useRef, useState, useEffect, createRef } from "react";

// @ts-ignore
import RTCMultiConnection from "@hacksore/rtcmulticonnection";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

console.log(RTCMultiConnection)

const useStyles = makeStyles(theme => ({
  "@global body": {
    background: "#000",
    color: "#fff",
  },
  videoPreview: {
    "& p": {
      margin: 0,
      padding: 0
    }
  },
  videoPreviewWrap: {
    position: "fixed",
    bottom: 0,
    display: "flex",
    flexDirection: "row",
  }
}));


const App = () => {
  const videoRef = useRef<any>(null);
  const classes = useStyles();
  const connection = useRef<any>(null);
  const [broadcasters, setBroadcasters] = useState<any>([]);

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
      // oneway: true // allows you to join and not present
    };

    // try to join
    connection.current.onstream = function (event: any) {
      setBroadcasters((broadcasters: any) => ([
        ...broadcasters,
        {
          id: event.userid,
          stream: event.stream,
          ref: createRef(),
        },
      ]));
    }

    // remove users when they leave
    connection.current.onstreamended =  function (event: any) {
      console.log(event);
      setBroadcasters((broadcasters: any) => {        
        return broadcasters.filter((item: any) => item.id !== event.userid)        
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // update the refs
    for (const [index, value] of Object.entries<any>(broadcasters)) {
      broadcasters[index].ref.current.srcObject = value.stream;
    }
  }, [broadcasters]);

  const goLive = () => {
    connection.current.openOrJoin(
      "test",
      (isRoomOpened: boolean, roomid: string, error: any) => {
        console.log(isRoomOpened, roomid, error);
      }
    );
  };

  const handleVideoSelect = (event: any) => {
    videoRef.current.srcObject = event.target.srcObject;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <video ref={videoRef} autoPlay controls style={{ width: 900, height: 500, background: "red" }} />        
      </div>


      <div className={classes.videoPreviewWrap}>
        {broadcasters.map((user: any, index: number) => (
          <div className={classes.videoPreview}>
            <p>{user.id}</p>
            <video
              onClick={handleVideoSelect}
              style={{ width: 300, height: 200 }}
              ref={broadcasters[index].ref}
              autoPlay
            />
          </div>
        ))}
      </div>

      <Button variant="contained" color="primary" onClick={goLive}>GO LIVE</Button>
      
    </div>
  );
};

export default App;
