import React, { useContext, useState } from 'react'
import { ReyDeLasRatasContext } from '../../ContextProvider/ContextProvider'
import { AccionesLobo } from '../../components/AccionesLobo/AccionesLobo'

export const Game = ({socket})=> {

    const { user, setUser, room, setRoom, userList, setUserList } = useContext(ReyDeLasRatasContext)
    const [objetivosLobos, setObjetivosLobos] = useState([])
    const [votos, setVotos] = useState([])

  return (
    <>
        <div>
            <p>Ronda {room?.round}</p>
            {room?.day_phase === 1 && <p>Fase del día: 🌙 Acciones 🌙</p>}
            {room?.day_phase === 2 && <p>Fase del día: 🌙 Resultados 🌙</p>}
            {room?.day_phase === 3 && <p>Fase del día: ☀️ Votaciones ☀️</p>}
            {room?.day_phase === 4 && <p>Fase del día: ☀️ Resultados ☀️</p>}
        </div>
        <div>
          <p>{user?.nick} eres {user?.rol}</p>
        </div>

        {/* Si eres lobo */}
        {user?.rol === "Lobo" && 
          <AccionesLobo 
            socket={socket} 
            userList={userList} 
            room={room} 
            objetivosLobos={objetivosLobos} 
            setObjetivosLobos={setObjetivosLobos} 
          />
        }

        {/* Si eres aldeano */}
        {user?.rol === "Aldeano" && 
        <div>
          <button>Dormir</button>
        </div>}
    </>
  )
}
