import { useContext, useState } from "react";
import { ReyDeLasRatasContext } from "../../ContextProvider/ContextProvider";
import { generadorCodigoSala } from "../../utils/utils";


export const CreateRoom = ({socket, setShowCreateRoom, setShowRoom}) => {

    const [nick, setNick] = useState('');
    const [roomName, setRoomName] = useState("")
    let { setUser, setRoom } = useContext(ReyDeLasRatasContext)

    const CreateRoom = async(e)=>{
        e.preventDefault();
        if(nick){
            try {
                await socket.emit("create_room", {
                    nick,
                    room_name: roomName,
                    room_code: generadorCodigoSala()
                })
                setShowCreateRoom(false),
                setShowRoom(true)
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    socket.on("create_room", (data)=>{
        setUser(data.user)
        setRoom(data.room)
    })

  return (
    <div className="createRoom-container">
        <h3>Crear Sala</h3>
        <form>
            <label>Introduce el nombre de la sala</label>
            <br />
            <input
                type="text"
                placeholder="Ejemplo: La cloaca"
                onChange={(e)=>setRoomName(e.target.value)}
                value={roomName}
            />
            <br />
            <label>Introduce tu nick</label>
            <br />
            <input
                type="text"
                placeholder="Ejemplo: SetaVoladora"
                onChange={(e)=>setNick(e.target.value)}
                value={nick}
            />
            <br />
            <br />
            <button onClick={CreateRoom}>Crear</button>
        </form>
        <br />
        <button onClick={()=>setShowCreateRoom(false)}>Volver</button>
    </div>
  )
}
