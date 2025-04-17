import express from "express";
import logger from "morgan";
import { Server } from "socket.io"
import { createServer } from "node:http"
import cors from 'cors'
import roomControllers from "./modules/room/room.controllers.js";
import userControllers from "./modules/user/user.controllers.js";
import { room_user_list } from "./utils/socketFunctions.js";

const port = process.env.PORT ?? 3000;

const app = express();
app.use(cors());
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.HOST_FRONT || `http://localhost:5173`,
        methods: ["GET, POST"]
    },
});

//Conexion de un usuario
io.on("connection", (socket)=>{
    console.log("User " + socket.id + " has connected!");

    //Crear una Sala
    socket.on('create_room', (data)=>{
        console.log(socket.id + " ha entrado en create_room");
        
        const create_room = async(data)=>{
            try {
                await roomControllers.CrearSala(data, socket.id)
                const room_result = await roomControllers.RoomInfo(data.room_code)
                const user_result = await userControllers.UserInfo(socket.id)

                socket.join(data.room_code)
                socket.emit("create_room", {room: room_result, user: user_result})
            } catch (error) {
                console.log(error);
            }
        }
        create_room(data);
    })

    //Unirse a una sala
    socket.on("join_room", (data)=>{
        console.log(socket.id + " ha entrado en join_room");

        const join_room = async(data)=>{
            try {
                await roomControllers.UnirseSala(data, socket.id)
                const room_result = await roomControllers.RoomInfo(data.room_code)
                const user_result = await userControllers.UserInfo(socket.id)
                console.log(room_result);
                if(!room_result){
                    socket.emit("join_room", {room: "No existe"})
                }
                else{
                    socket.join(data.room_code)
                    socket.emit("join_room", {room: room_result, user: user_result})
                }

            } 
            catch (error) {
                console.error(error);
            }
        }
        join_room(data);
    })

    //Los usuarios de una sala
    socket.on("room_user_list", (room_code)=>{
        console.log(socket.id + " ha entrado en room_user_list");

        const room_user_list = async(room_code)=>{
            try {
                const result = await roomControllers.RoomUserList(room_code);
                io.to(room_code).emit("room_user_list", result)  
            } 
            catch (error) {
                console.error(error);
            }
        }
        room_user_list(room_code);
    })

    //Algún cambio en un usuario
    socket.on("handle_user_changes", (data)=>{
        console.log(socket.id + " ha entrado en handle_user_changes");

        const handle_user_changes = async()=>{
            await userControllers.UserHasChanges(data);
            let lista_usuarios_actualizada = await roomControllers.RoomUserList(data.user.room_code)
            io.to(data.user.room_code).emit("room_user_list", lista_usuarios_actualizada)
        }
        handle_user_changes();
    })

    //Algún cambio en la sala
    socket.on("handle_room_changes", (data)=>{
        console.log(socket.id + " ha entrado en handle_room_changes");
        
    })

    //Un usuario envia un mensaje
    socket.on('send_message', (data)=>{       
        io.to(data.room_code).emit('send_message', data);  
    })

    //Un usuario abandona la sala
    socket.on("leave_room", (room_code)=>{
        console.log(socket.id + " se ha salido de la sala" + room_code);
        const leave_room = async()=>{
            try {
                let room_list = await roomControllers.RoomUserListWhenDisconnect(socket.id)
                let room_code = await roomControllers.GetRoomCode(socket.id)
                await userControllers.UserDisconnected(socket.id);
                socket.leave(room_code)

                if(room_list.length === 0){
                    await roomControllers.DeleteRoom(room_code)
                }
                io.to(room_code).emit("room_user_list", room_list)
            } 
            catch (error) {
                console.error(error); 
            }
        }
        leave_room();
    })

    //Un usuario se desconecta
    socket.on("disconnect", ()=>{
        console.log(socket.id + " se ha desconectado");
        
        const leave_room = async()=>{
            try {
                let room_list = await roomControllers.RoomUserListWhenDisconnect(socket.id)
                let room_code = await roomControllers.GetRoomCode(socket.id)
                await userControllers.UserDisconnected(socket.id);
                socket.leave(room_code)

                if(room_list.length === 0){
                    await roomControllers.DeleteRoom(room_code)
                }
                io.to(room_code).emit("room_user_list", room_list)
            } 
            catch (error) {
                console.error(error); 
            }
        }
        leave_room();
    })
})

app.use(logger("dev"))

server.listen(port, ()=>{
    console.log(`http://localhost:${port}`);
})
