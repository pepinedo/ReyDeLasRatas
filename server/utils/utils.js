export const repartirLobos =(reparto, cantidad_lobos, n)=>{

    for(let i = 0; i < cantidad_lobos; i++){
        let lobo = Math.floor(Math.random() * n)
        
        while(reparto[lobo] == "Aldeano"){
            if(reparto[lobo] == "Lobo"){
                Math.floor(Math.random() * n)
            }
            else{
                reparto[lobo] = "Lobo"
            }
        }
    }
    return reparto
}