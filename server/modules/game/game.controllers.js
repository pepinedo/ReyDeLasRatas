import { dbPool } from "../../BBDD/db.js";
import { repartirLobos } from "../../utils/utils.js"

class GameControllers {

    crearRoles = (n) =>{
        //1º Que todos sean aldeanos
        let reparto = []
        for(let i = 0; i < n; i++){
            reparto.push("Aldeano")
        }        
        
        //Si hay 5-6 jugadores -> 1 lobo
        if(n >= 5 && n <= 6){
            reparto = repartirLobos(reparto, 1, n);
        }
        //Si hay 7-10 jugadores -> 2 lobos
        else if(n >= 7 && n <= 10){
            reparto = repartirLobos(reparto, 2, n);
        }
        //Si hay 11-13 jugadores -> 3 lobos
        else if(n >= 11 && n <= 13){
            reparto = repartirLobos(reparto, 3, n);
        }
        //Si hay 14 o más jugadores -> 4 lobos
        else if(n >= 14){
            reparto = repartirLobos(reparto, 4, n);
        }
        return reparto
    }

    asignarRoles = async(room_code, roles)=>{

        let connection = await dbPool.getConnection();
        try {
            await connection.beginTransaction()
            let sql_userList = "SELECT * FROM user WHERE room_code=?";
            let userList = await connection.execute(sql_userList, [room_code])
            userList = userList[0]
            
            let i = 0;
            for(let rol of roles){
                userList[i].rol = rol                
                let sql_asignar_rol = "UPDATE user SET rol=? WHERE user_id=?"
                await connection.execute(sql_asignar_rol, [rol, userList[i].user_id])
                i++;
            }
            
            userList = await connection.execute(sql_userList, [room_code])
            userList = userList[0]

            await connection.commit()
            return userList
        } 
        catch (error) {
            await connection.rollback()
            console.error(error);
        }
        finally{
            connection.release()
        }
    }

} //Fin de GameControllers



export default new GameControllers;