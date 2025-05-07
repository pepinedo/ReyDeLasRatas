import React, { useState, useEffect, useContext } from 'react';
import { ReyDeLasRatasContext } from '../../ContextProvider/ContextProvider';
import Chat from '../../components/Chat/Chat';

const Room = ({ socket, setShowRoom, setGameOn }) => {
  let {room, setRoom, user, setUser, userList, setUserList } = useContext(ReyDeLasRatasContext)

  //La escucha de que algun usuario ha cambiado algo
  socket.on("room_user_list", (data)=>{
    setUserList(data);
  })

  //La escucha de que algo en la sala ha cambiado
  socket.on("handle_room_changes", (data)=>{
    setRoom(data)
  })

  //La escucha de que alguien le de a "Empezar"
  socket.on("start_game", (data)=>{

    for(let da of data){
      if(da.user_id === user.user_id){
        setUser({...da})
      }
    }
    setUserList(data);
    setShowRoom(false);
    setGameOn(true);
  })

  //Cuando el usuario cambia su estado
  const listo_para_empezar =()=>{
    //esta funcion se ejecuta despues del setUser y el socket.emit("handle_user_changes")
    setTimeout(()=>{
      socket.emit("change_round", room.room_code)
    }, 50);

    setUser({...user, is_ready: !user.is_ready})
    socket.emit("handle_user_changes", {
      user, 
      change: "is_ready", 
      set: !user.is_ready})
  }

  //Empezar el juego
  const startGame =()=>{
      socket.emit("start_game", {room, userList})
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
    })
    setShowRoom(false)
    socket.emit("leave_room", room.room_code)
  }

  console.log(userList);
  

  return (
    <div className="room-info">
      <h2>Sala {room?.room_name} </h2>
      <p>Código: <strong>{room?.room_code}</strong> </p>
      <p>Bienvenido {user?.nick} </p>
      {room?.round === 1 && <button onClick={startGame} >Empezar</button>}
      <div>
        <h4>Usuarios en la sala:</h4>
        {userList?.map((elem)=>{
          return (
            <p key={elem.user_id}>{elem.nick} {elem?.is_ready ? "✅":null} </p>
          )
        })}
      </div>

      <div>
        <button onClick={listo_para_empezar} >{!user.is_ready ? "Listo":"Cancelar"}</button>
        <br />
        <br />
        <button onClick={salirDeLaSala} >Salir</button>
      </div>

      <Chat socket={socket} nick={user.nick} room_code={user.room_code} room_name={room.room_name} />
    </div>
  );
};

export default Room;