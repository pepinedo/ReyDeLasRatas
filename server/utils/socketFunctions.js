import roomControllers from "../modules/room/room.controllers.js"
import userControllers from "../modules/user/user.controllers.js"

export const create_room = async(data)=>{
    try {
        await roomControllers.CrearSala(data, socket.id)
        const room_result = await roomControllers.RoomInfo(data.room_code)
        const user_result = await userControllers.UserInfo(socket.id)
        socket.emit("create_room", {room: room_result, user: user_result})
    } catch (error) {
        console.log(error);
    }
}

export const join_room = async(data)=>{
    try {
        await roomControllers.UnirseSala(data, socket.id)
        const room_result = await roomControllers.RoomInfo(data.room_code)
        const user_result = await userControllers.UserInfo(socket.id)
        socket.emit("join_room", {room: room_result, user: user_result})
    } 
    catch (error) {
        console.log(error);
    }
}

export const room_user_list = async(room_code)=>{
    try {
        const result = await roomControllers.RoomUserList(room_code);
        io.emit("room_user_list", result)
    } 
    catch (error) {
        console.error(error);
    }
}

export const disconnect = async(id)=>{
    try {
        await userControllers.UserDisconnected(id);
    } 
    catch (error) {
        console.error(error); 
    }
}