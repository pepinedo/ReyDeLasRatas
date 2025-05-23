import express from "express";
import logger from "morgan";
import { Server } from "socket.io"
import { createServer } from "node:http"
import cors from 'cors'
import roomControllers from "./modules/room/room.controllers.js";
import userControllers from "./modules/user/user.controllers.js";
import gameControllers from "./modules/game/game.controllers.js";

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
                const userList_result = await roomControllers.RoomUserList(data.room_code)

                socket.join(data.room_code)
                socket.emit("create_room", {room: room_result, user: user_result, userList: userList_result})
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
                const userList_result = await roomControllers.RoomUserList(data.room_code)
                if(!room_result){
                    socket.emit("join_room", {room: "No existe"})
                }
                else{
                    socket.join(data.room_code)
                    socket.emit("join_room", {room: room_result, user: user_result, userList: userList_result})
                    socket.to(data.room_code).emit("room_user_list", userList_result)
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

        const handle_room_changes = async()=>{
            const info_room = await roomControllers.RoomHasChanges(data);
            io.to(data.room.room_code).emit("handle_room_changes", info_room);
        }
        handle_room_changes();
    })

    //Un usuario envia un mensaje
    socket.on('send_message', (data)=>{       
        io.to(data.room_code).emit('send_message', data);  
    })

    //Activar boton de empezar juego
    socket.on("¿start_game?", (room_code)=>{
        console.log("¿start_game?");

        //cambiar de ronda
        const activar_desactivar_boton_empezar = async()=>{
            const todosListos = await userControllers.TodosListos(room_code);
            const info_room = await roomControllers.RoomInfo(room_code);
            
            if(todosListos){
                const info_room_return = await roomControllers.RoomHasChanges({
                    room: info_room, 
                    change: "round",
                    set: 1
                });
                io.to(room_code).emit("handle_room_changes", info_room_return);
            }
            else{
                const info_room_return = await roomControllers.RoomHasChanges({
                    room: info_room, 
                    change: "round",
                    set: 0
                });
                io.to(room_code).emit("handle_room_changes", info_room_return);
            }
        }
        activar_desactivar_boton_empezar();
    })

    //Empezar el juego
    socket.on("start_game", (data)=>{
        console.log(socket.id + " start_game");

        const start_game = async()=>{
            const roles = await gameControllers.crearRoles(data.userList.length)
            await gameControllers.asignarRoles(data.room.room_code, roles)
            await userControllers.QuitarListoEnTodos(data.room.room_code)
            let userList = await roomControllers.RoomUserList(data.room.room_code)
            io.to(data.room.room_code).emit("start_game", userList)
        }
        start_game();
        
    })

    //Un lobo hace objetivo a Alguien
    socket.on("seleccionar_objetivo_lobo", (data)=>{
        console.log(socket.id + " entra en seleccionar_objetivo_lobo");
        console.log(data);
        io.to(data.room_code).emit("seleccionar_objetivo_lobo", {
            user_id: data.user_id,
            objetive_id: data.objetive_id,
            nick_del_lobo: data.nick_del_lobo
        })
    })
    //Un lobo quita un objetivo
    socket.on("quitar_objetivo_lobo", (data)=>{
        console.log(socket.id + " entra en quitar_objetivo_lobo")
        console.log(data);
        io.to(data.room_code).emit("quitar_objetivo_lobo", {
            user_id: data.user_id,
            objetive_id: data.objetive_id,
            nick_del_lobo: data.nick_del_lobo
        })
    })

    //Cambiar de fase, cuando todos has hecho sus acciones
    socket.on("change_phase", (room_code)=>{
        console.log("change_phase");

        //cambiar de ronda
        const cambiar_de_fase = async()=>{
            const todosListos = await userControllers.TodosListos(room_code);
            const info_room = await roomControllers.RoomInfo(room_code);
            
            if(todosListos){
                let set;
                if(info_room.day_phase === 0){
                    set = 1;
                }
                else if(info_room.day_phase === 1){
                    set = 2;
                }
                else if(info_room.day_phase === 2){
                    set = 3;
                }
                else if(info_room.day_phase === 3){
                    set = 4;
                }
                else if(info_room.day_phase === 4){
                    set = 1
                }
                const info_room_return = await roomControllers.RoomHasChanges({
                    room: info_room, 
                    change: "day_phase",
                    set
                });
                io.to(room_code).emit("handle_room_changes", info_room_return);

                await userControllers.QuitarListoEnTodos(room_code);
                const userList_actualizada = await roomControllers.RoomUserList(room_code);
                io.to(room_code).emit("room_user_list", userList_actualizada);
            }

        }
        cambiar_de_fase();
    })

    //Cambiar de ronda, cuanto todos estan listos
    socket.on("change_round", (room_code)=>{
        console.log("change_round");

        //cambiar de ronda
        const cambiar_de_ronda = async()=>{
            const todosListos = await userControllers.TodosListos(room_code);
            const info_room = await roomControllers.RoomInfo(room_code);
            
            if(todosListos){
                const info_room_return = await roomControllers.RoomHasChanges({
                    room: info_room, 
                    change: "round",
                    set: info_room.round + 1
                });
                await userControllers.QuitarListoEnTodos(room_code);
                const userList_actualizada = await roomControllers.RoomUserList(room_code);                
                io.to(room_code).emit("room_user_list", userList_actualizada);
                io.to(room_code).emit("handle_room_changes", info_room_return);
            }

        }
        cambiar_de_ronda();
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
                io.to(room_code).emit('send_message', {
                    nick: "Server",
                    room_code,
                    msg: `Alguien se ha desconectado`,
                    time: new Date().toLocaleTimeString()
                }); 
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
                let nick = await userControllers.GetNick(socket.id);
                await userControllers.UserDisconnected(socket.id);
                socket.leave(room_code)

                if(room_list.length === 0){
                    await roomControllers.DeleteRoom(room_code)
                }
                io.to(room_code).emit("room_user_list", room_list)
                io.to(room_code).emit('send_message', {
                    nick: "Server",
                    room_code,
                    msg: `${nick} se ha desconectado`,
                    time: new Date().toLocaleTimeString()
                }); 
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
