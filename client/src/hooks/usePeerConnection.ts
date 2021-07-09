import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { createRoom, getRoomParticipants, joinRoom } from "../services/room";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userSettingsAtom } from "../state";

// FLOW:
// client joins room
// client gets all users
// client sends data to all peer ids
// remote user gets data stream
// if remote user is streaming it will call client with video stream
// client anwsers and can view stream

export const usePeerConnection = ({ setParticipantStream, getCurrentLocalVideoRef }: any) => {
  const [userSettings, setUserSettings] = useRecoilState(userSettingsAtom);
  const settingsRef = useRef<any>(userSettings);
  const peer = useRef<any>(null);

  // useed to get room id from url
  const params: any = useParams();
  const callBud = ({ id }: { id: string }) => {
    console.log(id, settingsRef.current);

    setParticipantStream({
      id: id,
      stream: null,
    });

    if (settingsRef.current.isStreaming) {
      console.log("I need to call this new client", id);
      // @ts-ignore TODO: fix
      peer.current.call(id, settingsRef.current.stream);
    }
  };

  useEffect(() => {
    settingsRef.current = userSettings;
  }, [userSettings]);

  useEffect(() => {
    // might need to store in ref to use elsewhere
    peer.current = new Peer({
      // debug: 4,
      host: window.location.hostname,
      port: parseInt(window.location.port),
      path: "/peerjs",
      config: {
        iceServers: [{ urls: "stun:stun1.l.google.com:19302" }],
      },
    });

    peer.current.on("open", async (id: any) => {
      // this has to be stale lol?
      setUserSettings({
        ...userSettings,
        id: id,
      });

      const response = await getRoomParticipants(params.id);
      response.participants.forEach((id: string) =>
        setParticipantStream({
          id: id,
          stream: null,
        })
      );

      if (!response.exists) {
        // create the room
        await createRoom(params.id);
      } else {
        // once I join make sure I become a particpant
        await joinRoom(params.id);
        console.log("I joined settting setParticipantStream", id);

        // TODO: I don't think this is right
        // setParticipantStream({
        //   id: id,
        //   stream: null,
        // });

      }

      // all the broadcasters have to start teh call to the viewers
      // so we start a data connection to them and ask if they are streaming
      // they will call us back if so
      for (const peerId of response.participants) {
        if (id === peerId) {
          return; // dont call yourself
        }

        console.log("start data channel", peerId);
        const conn = peer.current.connect(peerId);
        conn.on("open", () => {
          // open connection to the peer so we can ask if they are streaming
          conn.send("stream-check");
        });
      }
    });

    // anwser calls
    peer.current.on("call", async (call: any) => {
      console.log("getting a call rn");
    
      // if we are streaming chuck in the media we have when awering
      // TODO: I dont think this is possible
      // settingsRef.current.isStreaming ? call.answer() : call.answer(getCurrentLocalVideoRef());
      call.answer();

      // we got a remote stream
      call.on("stream", (remoteStream: any) => {
        console.log("got a remote stream", call, remoteStream);
              
        setParticipantStream({
          id: call.peer,
          stream: remoteStream,
        });
      });
    });

    // on data connection from remote user
    peer.current.on("connection", (conn: any) => {
      conn.on("data", (data: any) => {
        console.log("data stream opened from", conn.peer, data);
        callBud({ id: conn.peer });
      });

      // conn.on("open", () => {
      //   // conn.send("hello!");
      // });

    });
  }, []);
};
