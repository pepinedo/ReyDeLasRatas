import { useContext, useState } from 'react'
import { ReyDeLasRatasContext } from '../../ContextProvider/ContextProvider';

export const JoinRoom = ({socket, setShowJoinRoom, setShowRoom}) => {

    const [nick, setNick] = useState('');
    const [roomCode, setRoomCode] = useState('')
    const [error, setError] = useState("");
    let { setUser, setRoom } = useContext(ReyDeLasRatasContext)

    socket.on("join_room", (data)=>{
      if(data.room === "No existe"){
        setError("No existe esa sala")
      }
      else{
        setError("")
        setShowJoinRoom(false),
        setShowRoom(true)
        setUser(data.user)
        setRoom(data.room)
      }
  })

    const joinRoom = (e) =>{
        e.preventDefault();

        if(nick && roomCode){
          try {
            socket.emit("join_room", {
                nick,
                room_code: roomCode, 
            })
          } 
          catch (error) {
            console.log(error);
          }
        }
    }

  return (
    <div className="createRoom-container">
        <h3>Unirse a una Sala</h3>
        <form>
            <label>Introduce tu nick</label>
            <br />
            <input
                type="text"
                placeholder="Ejemplo: SetaVoladora"
                onChange={(e) => setNick(e.target.value)}
                value={nick}
            />
            <br />
            <br />
            <label>Introduce el código de la sala</label>
            <br />
            <input
                type="text"
                placeholder="ID de la sala"
                onChange={(e) => setRoomCode(e.target.value)}
                value={roomCode}
            />
            {error && <p style={{color: "red"}} >{error}</p>}
            <br />
            <br />
            <button onClick={joinRoom}>Unirse</button>
        </form>
        <br />
        <button onClick={()=>setShowJoinRoom(false)}>Volver</button>
    </div>
  )
}
