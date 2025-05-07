import executeQuery, { dbPool } from "../../BBDD/db.js";

class UserControllers {

    UserInfo = async(user_socket_id)=>{
        let result;

        user_socket_id = String(user_socket_id).trim();
    
        let connection = await dbPool.getConnection();
        try {
            let sql = "SELECT * FROM user WHERE user_socket_id=?"
            result = await connection.execute(sql, [user_socket_id])
        } 
        catch (error) {
            console.error(error);
        }
        finally{
            connection.release();
        }
        return result[0][0]
    }   

    UserDisconnected = async(user_socket_id)=>{

        user_socket_id = String(user_socket_id).trim();

        let connection = await dbPool.getConnection();
        try {
            let sql = "DELETE FROM user WHERE user_socket_id=?";
            await connection.execute(sql, [user_socket_id]);
        } 
        catch (error) {
            console.error(error);  
        }
        finally{
            connection.release();
        }
    }

    UserHasChanges = async(data)=>{
        const {user, change, set} = data
        
        let connection = await dbPool.getConnection()
        try {
            let sql_cambiar = `UPDATE user SET ${change}=? WHERE user_id=?`
            let values_cambiar = [set, user.user_id]
            await connection.execute(sql_cambiar, values_cambiar)
        } 
        catch (error) {
            console.error(error);
            connection.rollback()
        }
        finally{
            connection.release()
        }    
    }

    GetNick = async(data)=>{
        let nick;
        let connection = await dbPool.getConnection()
        try {
            let sql = "SELECT nick FROM user WHERE user_socket_id=?"
            nick = await connection.query(sql, [data]);
        } 
        catch (error) {
            console.error(error); 
        }
        finally{
            connection.release()
        }
        return nick[0][0].nick;
    }

    TodosListos = async(room_code)=>{
        let result = true;

        let connection = await dbPool.getConnection()
        try {
            let sql = "SELECT is_ready FROM user WHERE room_code=?"
            let users_ready = await connection.execute(sql, [room_code])
            users_ready = users_ready[0]

            if(users_ready.length >= 5){
                for(let user of users_ready){
                    if(user.is_ready !== 1){
                        result = false;
                    }
                }
            }
            else{
                result = false;
            }

        } 
        catch (error) {
            console.error(error);
        }
        finally{
            connection.release();
        }
        return result;
    }

    QuitarListoEnTodos = async(room_code)=>{
        let result;
        let connection = await dbPool.getConnection()
        try {
            let sql_actualizar = "UPDATE user SET is_ready=0 WHERE room_code=?"
            await connection.execute(sql_actualizar, [room_code])
        } 
        catch (error) {
            console.error(error); 
        }
        finally{
            connection.release();
        }
    }

} //Fin de UserControllers

export default new UserControllers;