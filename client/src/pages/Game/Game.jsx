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

    //La escucha de que todos estan listos, para cambiar de Fase
    const listo_cancelar =()=>{

        setUser({...user, is_ready: !user.is_ready})
        socket.emit("handle_user_changes", {user, change: "is_ready"})
        if(userList.length >= 5){      
          let result = 0
          for(let i = 0; i < userList.length; i++){
            if(userList[i].is_ready){
              result += 1;
            }
          }
          if(result == userList.length && room.day_phase === 0){
            socket.emit("handle_room_changes", {room, change: "day_phase", set: 1})
            socket.emit("quitar_listo_de_todos", {room_code: room.room_code})
          }
          else if(result == userList.length && room.day_phase === 1){
            socket.emit("handle_room_changes", {room, change: "day_phase", set: 2})
            socket.emit("quitar_listo_de_todos", {room_code: room.room_code}) 
          }
          else if(result == userList.length && room.day_phase === 2){
            socket.emit("handle_room_changes", {room, change: "day_phase", set: 3})
            socket.emit("quitar_listo_de_todos", {room_code: room.room_code}) 
          }
          else if(result == userList.length && room.day_phase === 3){
            socket.emit("handle_room_changes", {room, change: "day_phase", set: 4})
            socket.emit("quitar_listo_de_todos", {room_code: room.room_code}) 
          }
          else if(result == userList.length && room.day_phase === 4){
            socket.emit("handle_room_changes", {room, change: "day_phase", set: 1})
            socket.emit("quitar_listo_de_todos", {room_code: room.room_code})
          }
        }
    }

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
            {room?.day_phase === 1 && <p>Fase del día: 🌙 Acciones 🌙</p>}
            {room?.day_phase === 2 && <p>Fase del día: 🌙 Resultados 🌙</p>}
            {room?.day_phase === 3 && <p>Fase del día: ☀️ Votaciones ☀️</p>}
            {room?.day_phase === 4 && <p>Fase del día: ☀️ Resultados ☀️</p>}
        </div>

        {room?.day_phase === 1 &&
        <>
          {/* Si eres lobo */}
          {user?.rol === "Lobo" &&
            <AccionesLobo
              socket={socket}
              user={user}
              userList={userList}
              room={room}
              objetivosLobos={objetivosLobos}
              setObjetivosLobos={setObjetivosLobos}
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
    </>
  )
}
