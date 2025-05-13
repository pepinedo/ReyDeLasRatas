import React from 'react'

export const AccionesAldeano = ({socket, user, setUser, listo_cancelar}) => {

  return (
    <div>
        <button onClick={listo_cancelar}>{!user?.is_ready ? "Listo" : "Cancelar"} </button>
    </div>
  )
}
