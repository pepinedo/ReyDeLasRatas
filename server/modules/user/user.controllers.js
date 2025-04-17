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
        const {user, change} = data
        
        let connection = await dbPool.getConnection()
        try {
            let sql_cambiar = `UPDATE user SET ${change}=? WHERE user_id=?`
            let values_cambiar = [user[change], user.user_id]
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

} //Fin de UserControllers

export default new UserControllers;