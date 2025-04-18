import React, { useState, useEffect, useContext } from 'react';
import { ReyDeLasRatasContext } from '../../ContextProvider/ContextProvider';
import Chat from '../../components/Chat/Chat';

const Room = ({ socket, setShowRoom }) => {
  let {room, setRoom, user, setUser, setGameOn } = useContext(ReyDeLasRatasContext)
  const [userList, setUserList] = useState([])

  //La escucha de que algun usuario ha cambiado algo
  socket.on("room_user_list", (data)=>{
    setUserList(data);
  })

  //La escucha de que algo en la sala ha cambiado
  socket.on("handle_room_changes", (data)=>{
    console.log(data);
  })

  //Obtener la lista de usuarios
  useEffect(()=>{
      if(room.room_code){
        socket.emit("room_user_list", room.room_code)
      }
  },[])

  //Cuando el usuaario cambia su estado
  useEffect(()=>{
      if(user.user_id){
        socket.emit("handle_user_changes", {user, change: "is_ready"})
      }
  },[user])

  //Cuando todos estan listos
  useEffect(()=>{
        
      if(userList.length > 1){      
        let result = 0
        for(let i = 0; i < userList.length; i++){
          if(userList[i].is_ready){
            result += 1;
          }
        }
        console.log(result, userList.length);
        
        if(result == userList.length){
          setRoom({...room, round: 1})
          socket.emit("handle_room_changes", {room, change: "round"})
          console.log("Se cambia a 1");
          
        }
        else{
          setRoom({...room, round: 0})
          socket.emit("handle_room_changes", {room, change: "round"})
          console.log("Se cambia a 0");
        }
      }

  },[userList])

  //Empezar el juego
  const startGame =()=>{
    setGameOn(true)
    setShowRoom(false)
  }

  //Salir de la sala
  const salirDeLaSala =()=>{
    setUser({
      user_id: null,
      user_socket_id: "",
      nick: "",
      room_code: "",
      rol: "",
      vote: "",
      action: "",
      is_ready: false,
      is_dead: false,
    }),
    setRoom({
      room_id: null,
      room_name: "",
      room_code: "",
      round: 0,
      day_phase: 0,
      total_players: 0,
      dead_players: 0,
      players_ready: 0
    })
    setShowRoom(false)
    socket.emit("leave_room", room.room_code)
  }

  return (
    <div className="room-info">
      <h2>Sala {room?.room_name} </h2>
      <p>Código: <strong>{room?.room_code}</strong> </p>
      <p>Bienvenido {user?.nick} </p>
      {room?.round === 1 && <button>Empezar</button>}
      <div>
        <h4>Usuarios en la sala:</h4>
        {userList?.map((elem)=>{
          return (
            <p key={elem.user_id}>{elem.nick} {elem?.is_ready ? "✅":null} </p>
          )
        })}
      </div>

      <div>
        <button onClick={()=>setUser({...user, is_ready: !user.is_ready})} >{!user.is_ready ? "Listo":"Cancelar"}</button>
        <br />
        <button onClick={salirDeLaSala} >Salir</button>
      </div>

      <Chat socket={socket} nick={user.nick} room_code={user.room_code} room_name={room.room_name} />
    </div>
  );
};

export default Room;