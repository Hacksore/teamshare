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

export const usePeerConnection = ({ setParticipantStream }: any) => {
  const [userSettings, setUserSettings] = useRecoilState(userSettingsAtom);
  const settingsRef = useRef<any>(userSettings);
  const peer = useRef<any>(null);

  // useed to get room id from url
  const params: any = useParams();
  const callBud = ({ id }: {id: string}) => {
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
  }

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
      // save id from server locally
      // setUserId(id);
      setUserSettings({
        ...userSettings,
        id: id,
      });

      const response = await getRoomParticipants(params.id);
      // console.log("room participants", response.participants);
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
        await joinRoom(params.id);
      }

      // TODO: all the broadcasters have to start teh call to the viewers
      // call all peers
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

        // conn.on("data", (data: any) => {
        //   console.log("client ack", data);

        // })
      }
    });

    // anwser calls
    peer.current.on("call", async (call: any) => {
      console.log("getting a call rn");

      // @ts-ignore
      // TODO: if we are streaming chuck in the media
      call.answer();

      // we got a remote stream
      call.on("stream", (remoteStream: any) => {
        console.log("got a remote stream");
        setParticipantStream({
          id: call.peer,
          stream: remoteStream,
        });

        // videoRef.current.srcObject = remoteStream;
      });
    });

    // on data connection from remote user
    peer.current.on("connection", (conn: any) => {
      conn.on("data", (data: any) => {
        console.log("data stream opened from", conn.peer, data);

        callBud({id: conn.peer});

      });

      conn.on("open", () => {
        conn.send("hello!");
      });
    });
  }, []);
  
}