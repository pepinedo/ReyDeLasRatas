import { useState } from "react";
import { CreateRoom } from "../CreateRoom/CreateRoom";
import { JoinRoom } from "../JoinRoom/JoinRoom";
import Room from "../Room/Room";
import { Game } from "../Game/Game";

export const Home = ({socket}) => {

  const [showCreateRoom, setShowCreateRoom] = useState(false)
  const [showJoinRoom, setShowJoinRoom] = useState(false)
  const [showRoom, setShowRoom] = useState(false)
  const [gameOn, setGameOn] = useState(false)

      
    return (
      <div>
        {!showCreateRoom && !showJoinRoom && !showRoom && !gameOn &&
        <div>
          <h1>Rey de las Ratas</h1>
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
                setGameOn={setGameOn}
            />
        }
        {gameOn && 
          <Game 
              socket={socket}
          />
        }
      </div>
    )
}
