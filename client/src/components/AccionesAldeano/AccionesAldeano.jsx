import React from 'react'

export const AccionesAldeano = ({socket, user, setUser, listo_cancelar}) => {

    const dormir =()=>{
        listo_cancelar();
    }

  return (
    <div>
        <button onClick={dormir}> {!user?.is_ready ? "Dormir" : "Cancelar"} </button>
    </div>
  )
}
