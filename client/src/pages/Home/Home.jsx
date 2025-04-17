import { useState } from "react";
import { CreateRoom } from "../CreateRoom/CreateRoom";
import { JoinRoom } from "../JoinRoom/JoinRoom";
import Room from "../Room/Room";

export const Home = ({socket}) => {

  const [showCreateRoom, setShowCreateRoom] = useState(false)
  const [showJoinRoom, setShowJoinRoom] = useState(false)
  const [showRoom, setShowRoom] = useState(false) 
      
    return (
      <div>
        <h1>Rey de las Ratas</h1>
        {!showCreateRoom && !showJoinRoom && !showRoom &&
        <div>
          <button onClick={()=>setShowCreateRoom(true)} >Crear Sala</button>
          <button onClick={()=>setShowJoinRoom(true)} >Unirse a Sala</button>
        </div>}
        {showCreateRoom && 
            <CreateRoom 
                socket={socket} 
                setShowCreateRoom={setShowCreateRoom}
                setShowRoom={setShowRoom}
            />
        }
        {showJoinRoom && 
            <JoinRoom 
                socket={socket} 
                setShowJoinRoom={setShowJoinRoom}
                setShowRoom={setShowRoom}
            />
        }
        {showRoom && 
            <Room 
                socket={socket}
                setShowRoom={setShowRoom}
            />
        }
      </div>
    )
}
