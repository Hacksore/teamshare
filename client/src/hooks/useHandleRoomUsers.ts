import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userSettingsAtom, peersAtom, peerStreamSetSelector } from "../state";
import _, { add } from "lodash";

export const useHandleRoomUsers = (peerJS: any) => {
  const [isFirstJoin, setIsFirstJoin] = useState(true);
  const userInfo = useRecoilValue(userSettingsAtom);
  const [peers, setPeers] = useRecoilState(peersAtom);
  const setPeerStream = useSetRecoilState(peerStreamSetSelector);

  useEffect(() => {
    if (!peerJS) {
      return;
    }

    peerJS.on("call", (call: any) => {
      call.answer(userInfo.stream);
      
      call.on("stream", function (remoteStream: any) {
        console.log("log a remote stream from a call awnser", call, remoteStream);
        setPeerStream({
          peerId: call.peer,
          stream: remoteStream,
        });
      });
    });
  }, [peerJS, userInfo.stream]);

  const callAllPeers = useCallback(
    (users: any) => {
      for (const user of users) {
        if (user.peerId === userInfo.peerId) {
          continue; // don't call yourself
        }

        const call = peerJS.call(user.peerId, new MediaStream());
        call.on("stream", (remoteStream: any) => {    
          // console.log("got a remote stream", call, remoteStream);
          setPeerStream({
            peerId: user.peerId,
            stream: remoteStream,
          });
        });
      }
    },
    [peerJS, userInfo]
  );

  const handleRoomUserUpdate = useCallback(
    (users: any) => {
      if (isFirstJoin) {
        callAllPeers(users);
        setIsFirstJoin(false);
      }

      const userObject = users.map((val: any) => ({
        id: val.id,
        peerId: val.peerId,
        stream: null,
        isStreaming: false,
      }));

      setPeers(userObject);
    },
    [peers, callAllPeers, isFirstJoin]
  );

  return { handleRoomUserUpdate, callAllPeers };
};
