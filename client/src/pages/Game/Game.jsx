import React, { useContext, useState, useEffect } from 'react'
import { ReyDeLasRatasContext } from '../../ContextProvider/ContextProvider'
import { AccionesLobo } from '../../components/AccionesLobo/AccionesLobo'
import { AccionesAldeano } from '../../components/AccionesAldeano/AccionesAldeano'

export const Game = ({socket})=> {

    const { user, setUser, room, setRoom, userList, setUserList } = useContext(ReyDeLasRatasContext)
    const [objetivosLobos, setObjetivosLobos] = useState([])
    const [votos, setVotos] = useState([])

    //La escucha de que algun usuario ha cambiado algo
    socket.on("room_user_list", (data)=>{      
      setUserList(data);
    })
    //La escucha de que algo en la sala ha cambiado
    socket.on("handle_room_changes", (data)=>{
      setRoom(data)
    })

    const listo_cancelar =()=>{
        //esta funcion se ejecuta despues del setUser y el socket.emit("handle_user_changes")
        setTimeout(()=>{
          socket.emit("change_phase", room.room_code)
        }, 100);
        
        if(room.day_phase === 4){
          setTimeout(()=>{
            socket.emit("change_round", room.room_code)
          }, 50);
        }

        setUser({...user, is_ready: !user.is_ready})
        socket.emit("handle_user_changes", {
          user, 
          change: "is_ready", 
          set: !user.is_ready})
    }

    console.table(userList)

  return (
    <>
        <div>
            <p>Ronda {room?.round}</p>
            <p>{user?.nick} eres {user?.rol}</p>
            {room?.day_phase === 0 && 
            <div style={{background: "beige"}}>
              <h3>Reglas: </h3>
              <p>1ª No hace falta cerrar los ojos</p>
              <p>2ª No se, es por rellenar</p>
              <hr />

            </div>}
            {room?.day_phase === 1 && <p>1ª 🌙 Acciones Nocturnas🌙</p>}
            {room?.day_phase === 2 && <p>2ª 🌙 Resultados Noche🌙</p>}
            {room?.day_phase === 3 && <p>3ª ☀️ Votaciones ☀️</p>}
            {room?.day_phase === 4 && <p>4ª ☀️ Resultados Votaciones☀️</p>}
        </div>

        {room?.day_phase === 0 &&
        <button onClick={listo_cancelar}>{!user?.is_ready ? "Listo" : "Cancelar"} </button>}

        {room?.day_phase === 1 &&
        <>
          {/* Si eres lobo */}
          {user?.rol === "Lobo" &&
            <AccionesLobo
              socket={socket}
              user={user}
              setUser={setUser}
              userList={userList}
              room={room}
              objetivosLobos={objetivosLobos}
              setObjetivosLobos={setObjetivosLobos}
              listo_cancelar={listo_cancelar}
            />
          }
          {/* Si eres aldeano */}
          {user?.rol === "Aldeano" &&
            <AccionesAldeano
              socket={socket}
              user={user}
              setUser={setUser}
              listo_cancelar={listo_cancelar}
            />
          }
        </>}

        {room?.day_phase === 2 &&
        <button onClick={listo_cancelar}>{user?.is_ready ? "Cancelar" : "Siguiente"} </button>}

        {room?.day_phase === 3 &&
        <button onClick={listo_cancelar}>{user?.is_ready ? "Cancelar" : "Siguiente"} </button>}

        {room?.day_phase === 4 &&
        <button onClick={listo_cancelar}>{user?.is_ready ? "Cancelar" : "Siguiente"} </button>}
    </>
  )
}
