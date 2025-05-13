

export const AccionesLobo = ({socket, user, setUser, room, userList, objetivosLobos, setObjetivosLobos, listo_cancelar}) => {

    //botón del lobo de elegir objetivo
    const objetivo_de_muerte =(objetive_id)=>{

        const objetivoSeleccionadoPorMi = objetivosLobos.some(
            elem => elem.objetive_id === objetive_id && elem.user_id === user.user_id
        );
        const objetivoSeleccionadoPorOtro = objetivosLobos.some(
            elem => elem.objetive_id === objetive_id && elem.user_id !== user.user_id
        );
        const yaTieneObjetivoSeleccionado = objetivosLobos.some(
            elem => elem.user_id === user.user_id
        );
        const enviarObjetivoSeleccionado =()=>{
            socket.emit("seleccionar_objetivo_lobo", {
                user_id: user.user_id, 
                nick_del_lobo: user.nick,
                objetive_id, 
                room_code: room.room_code
            })
        };
        const enviarQuitarObjetivo =()=>{
            socket.emit("quitar_objetivo_lobo", {
                user_id: user.user_id, 
                nick_del_lobo: user.nick,
                objetive_id, 
                room_code: room.room_code
            })
        };

        if(objetivoSeleccionadoPorOtro && !objetivoSeleccionadoPorMi && !yaTieneObjetivoSeleccionado){
            enviarObjetivoSeleccionado();
        }
        else if(!objetivoSeleccionadoPorMi && !yaTieneObjetivoSeleccionado){
            enviarObjetivoSeleccionado();
        }
        else if (objetivoSeleccionadoPorMi) {
            enviarQuitarObjetivo();
        }
        else if(!objetivoSeleccionadoPorMi && yaTieneObjetivoSeleccionado){
            enviarQuitarObjetivo();
            enviarObjetivoSeleccionado();
        }
        socket.emit("handle_user_changes", {user, change: "is_ready", set: false})
        setUser({...user, is_ready: false})
    };

    socket.on("seleccionar_objetivo_lobo", (data)=>{
        let aux = [...objetivosLobos]
        aux.push(data)
        setObjetivosLobos(aux)
    });
    socket.on("quitar_objetivo_lobo", (data)=>{
        setObjetivosLobos(objetivosLobos.filter((elem)=> elem.user_id !== data.user_id ))
    });

    console.table(objetivosLobos)
    
    
  return (
    <div>
        <p>Elige a quien matar</p>
        {userList?.map((elem)=>{
            if(elem.rol != "Lobo"){                
                return(
                    <div key={elem.user_id}>
                        <button onClick={()=>objetivo_de_muerte(elem.user_id)} >{elem?.nick}  </button>
                        {objetivosLobos.map((elem2)=>{
                            if(elem2.objetive_id === elem.user_id){
                                return(
                                    <p>{elem.nick} Seleccionado por {elem2.nick_del_lobo}</p>
                                )
                            }
                        })}
                    </div>
                )
        }})}
        {objetivosLobos.some(obj => obj.nick_del_lobo === user.nick) && <button onClick={listo_cancelar}>{user?.is_ready?"Cancelar":"Listo"}</button>}
    </div>
  )
}