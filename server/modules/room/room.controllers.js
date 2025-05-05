import executeQuery, { dbPool } from "../../BBDD/db.js";

class RoomControllers {

    CrearSala = async(data, user_socket_id)=>{
        const {nick, room_name, room_code} = data;

        const connection = await dbPool.getConnection();
        try {
            await connection.beginTransaction();

            //Creacion de la sala
            let sql_create_room = `INSERT INTO room (room_name, room_code) VALUES (?,?)`
            let values_create_room = [room_name, room_code]
            let result_create_room = await connection.query(sql_create_room, values_create_room);
            
            //Unirse a la sala
            let sql_join_room = `INSERT INTO user (user_socket_id, nick, room_code) VALUES (?,?,?)`
            let values_join_room = [user_socket_id, nick, room_code]
            await connection.query(sql_join_room, values_join_room);
            
            await connection.commit();
        } 
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally{
            connection.release();
        }
    }

    UnirseSala = async(data, user_socket_id)=>{

        let {nick, room_code} = data

        const connection = await dbPool.getConnection();
        try {
            await connection.beginTransaction();

            //Primero comprobar que la sala existe
            let sql_room_exist = 'SELECT room_id, room_code FROM room WHERE room_code=?'
            let result_room_exist = await connection.query(sql_room_exist, [room_code]);
            
            //Si no existe, lanzar el error
            if(result_room_exist[0] == ""){
                console.log(`La sala con el código ${room_code} no existe`); 
                throw new Error(`La sala con el código ${room_code} no existe`)
            }
            
            //Crear al usuario (e indicar de que sala es)
            let sql_join_room = 'INSERT INTO user (user_socket_id, nick, room_code) VALUES (?,?,?)'
            let values_join_room = [user_socket_id, nick, room_code]
            await connection.query(sql_join_room, values_join_room);

            await connection.commit();
        }
        catch (error) {
            await connection.rollback();
            console.error(error);
            
        }
        finally{
            connection.release();
        }
    }

    RoomInfo = async(room_code)=>{
        let result
        let connection = await dbPool.getConnection();
        try {
            let sql = "SELECT * FROM room WHERE room_code=?"
            result = await connection.execute(sql, [room_code]);
        } 
        catch (error) {
            throw error;
        }
        finally{
            connection.release();
        }
        return result[0][0]
    }

    RoomUserList = async(room_code)=>{
        let result

        let connection = await dbPool.getConnection()
        try {
            let sql = "SELECT * FROM user WHERE room_code=?"
            result = await connection.execute(sql, [room_code])
        } 
        catch (error) {
            console.error(error);   
        }
        finally{
            connection.release()
        }
        return result[0]
    }

    RoomUserListWhenDisconnect = async(user_socket_id)=>{
        let result;

        let connection = await dbPool.getConnection();
        try{
            await connection.beginTransaction();

            //Extraer el código de la sala
            let sql_room_code = "SELECT room_code FROM user WHERE user_socket_id=?"
            let result_room_code = await connection.execute(sql_room_code, [user_socket_id]);
            let room_code = result_room_code[0][0].room_code;
            
            //Obetener la info de todos los miembros de la sala excepto del usuario que se está desconectando
            let sql_room_list = "SELECT * FROM user WHERE room_code=? AND user_socket_id !=?"
            result = await connection.execute(sql_room_list, [room_code, user_socket_id])

            await connection.commit();
        }
        catch(error){
            await connection.rollback();
            console.error(error);
        }
        finally{
            connection.release();
        }
        return result[0]
    }

    GetRoomCode = async(user_socket_id)=>{
        let result;

        let connection = await dbPool.getConnection()
        try {
            let sql = "SELECT room_code FROM user WHERE user_socket_id=?"
            result = await connection.execute(sql, [user_socket_id])
            
        } 
        catch (error) {
            console.error(error);
        }
        finally{
            connection.release()
        }
        return result[0][0].room_code
    }

    DeleteRoom = async(room_code)=>{

        try {
            let sql = "DELETE FROM room WHERE room_code=?"
            await executeQuery(sql, [room_code])    
        } 
        catch (error) {
            console.error(error);
        }
    }

    RoomHasChanges = async(data)=>{
        const {room, change, set} = data;
        let result;

        let connection = await dbPool.getConnection();
        try {
            await connection.beginTransaction();

            //Actualizar la sala
            const sql_actualizar_cambios = `UPDATE room SET ${change}=? WHERE room_id=?`;
            const values = [set, room.room_id];
            await connection.execute(sql_actualizar_cambios, values)

            //Obtener los cambios de la sala
            let sql_info_sala = `SELECT * FROM room WHERE room_id=?`
            result = await connection.execute(sql_info_sala, [room.room_id])

            await connection.commit();
        }
        catch (error) {
            await connection.rollback();
            console.error(error);
        }
        finally{
            connection.release()
        }
        return result[0][0];
    }

} //Fin del RoomControllers


export default new RoomControllers;