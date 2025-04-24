import React, { useState } from 'react'

export const AccionesLobo = ({socket, room, userList, objetivosLobos, setObjetivosLobos}) => {

    //botón del lobo de elegir objetivo
    const objetivo_de_muerte =(user_id)=>{
        if(!objetivosLobos.includes(user_id)){
            socket.emit("seleccionar_objetivo_lobo", {user_id, room_code: room.room_code})
        }
        else{
            socket.emit("quitar_objetivo_lobo", {user_id, room_code: room.room_code})
        }
    }
    socket.on("seleccionar_objetivo_lobo", (user_id)=>{
        console.log("seleccionar_objetivo_lobo", user_id);
        let aux = [...objetivosLobos]
        aux.push(user_id)
        
        setObjetivosLobos(aux)
        console.log(aux);
    })
    socket.on("quitar_objetivo_lobo", (user_id)=>{
        console.log("quitar_objetivo_lobo", user_id);
        setObjetivosLobos(objetivosLobos.filter((elem)=> elem !== user_id ))
    })

    console.log("objetivos: ", objetivosLobos);
    
  return (
    <div>
        <p>Elige a quien matar</p>
        {userList?.map((elem)=>{
            if(elem.rol != "Lobo"){
                return(
                    <div>
                        <button key={elem.user_id} onClick={()=>objetivo_de_muerte(elem.user_id)} >{elem?.nick}  </button>
                        {objetivosLobos.includes(elem.user_id) && <p>🐺</p>}
                    </div>
                )
        }})}
    </div>
  )
}
