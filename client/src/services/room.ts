export const getRoomParticipants = async (id: string) => {
  // Get a list of all peers
  const response = await fetch(`/peerjs/participants/${id}`, {
    method: "GET"   
  })
  .then(res => res.json());

  return response;

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