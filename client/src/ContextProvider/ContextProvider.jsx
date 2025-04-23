import { createContext, useState } from "react"

export const ReyDeLasRatasContext = createContext();

export const ContextProvider = ({children}) => {

  const [user, setUser] = useState({
    user_id: null,
    user_socket_id: "",
    nick: "",
    room_code: "",
    rol: "",
    vote: "",
    action: "",
    is_ready: false,
    is_dead: false,
  });

  const [room, setRoom] = useState({
    room_id: null,
    room_name: "",
    room_code: "",
    round: 0,
    day_phase: 0,
  });

  const [userList, setUserList] = useState([])
  
  const [isInRoom, SetIsInRoom] = useState(false)

  return (
    <ReyDeLasRatasContext.Provider value={{
        user,
        setUser,
        room,
        setRoom,
        userList,
        setUserList,
        isInRoom,
    }}>
        {children}
    </ReyDeLasRatasContext.Provider>
  )
}
