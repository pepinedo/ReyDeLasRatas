import React, { useContext } from 'react'
import { ReyDeLasRatasContext } from '../../ContextProvider/ContextProvider'

export const Game = ({socket})=> {

    const { user, setUser, room, setRoom } = useContext(ReyDeLasRatasContext)

  return (
    <>
        <div>
            <p>{room?.round}</p>
            {room?.day_phase === 1 && <p>Fase del día: 🌙 Acciones 🌙</p>}
            {room?.day_phase === 2 && <p>Fase del día: 🌙 Resultados 🌙</p>}
            {room?.day_phase === 3 && <p>Fase del día: ☀️ Votaciones ☀️</p>}
            {room?.day_phase === 4 && <p>Fase del día: ☀️ Resultados ☀️</p>}
        </div>
        <div>
          <p>{user?.nick} eres {user?.rol}</p>
        </div>
    </>
  )
}
