import { useCallback, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userSettingsAtom, peersAtom, peerStreamSetSelector } from "../state";

export const useHandleRoomUsers = (peerJS: any) => {
  const [isFirstJoin, setIsFirstJoin] = useState(true);
  const userInfo = useRecoilValue(userSettingsAtom);
  const setPeers = useSetRecoilState(peersAtom);
  const setPeerStream = useSetRecoilState(peerStreamSetSelector);

  useEffect(() => {
    if (!peerJS) {
      return;
    }

    peerJS.on('call', (call: any) => { 
      console.log("you are getting called", call);
      // get our local stream
      console.log(userInfo);
      call.answer(userInfo.stream);
    });

  }, [peerJS, userInfo.stream]);

  const callAllPeers = useCallback((users: any) => {
  
    for (const user of users) {
      if (user.peerId === userInfo.peerId) {
        continue; // don't call yourself
      }
  
      console.log("Calling peeer", user.peerId);
      const call = peerJS.call(user.peerId, new MediaStream());
      call.on('stream', (remoteStream: any) => {
        // Show stream in some video/canvas element.
        console.log("got a remote stream", remoteStream);
        setPeerStream({
          peerId: user.peerId,
          stream: remoteStream,
        });
      });

    };
  }, [peerJS, userInfo.peerId]);
  
  const handleRoomUserUpdate = useCallback((users: any) => {

    if (isFirstJoin) {
      callAllPeers(users);
      setIsFirstJoin(false);
    }

    setPeers(
      users.map((val: any) => ({
        id: val.id,
        peerId: val.peerId,
        stream: null,
        isStreaming: false,
      }))
    );
  }, [callAllPeers, isFirstJoin]);

  return { handleRoomUserUpdate, callAllPeers }
}