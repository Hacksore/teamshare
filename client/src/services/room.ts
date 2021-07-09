interface IRoomParticpants {
  participants: string[];
  exists: boolean;
}

export const getRoomParticipants = async (id: string): Promise<IRoomParticpants> => {
  // Get a list of all peers
  const response = await fetch(`/peerjs/participants/${id}`, {
    method: "GET"   
  })
  .then(res => res.json());
  
  const ids = Object.keys(response.participants);
  return {
    participants: ids,
    exists: response.exists
  }
}

export const createRoom = async (id: string) => {
  return fetch("/peerjs/room", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      roomId: id
    })
  })
  .then(res => res.json());

}

export const joinRoom = async (id: string) => {
  return fetch("/peerjs/room", {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      roomId: id
    })
  })
  .then(res => res.json());

}