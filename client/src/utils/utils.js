export const generadorCodigoSala =()=>{
    let res = "";
    const c  = "ABCDEFGHIJKMNOPQRSTUVWXYZ";

    for(let i = 0; i < 6; i++){
        const numeroAleatorio = Math.floor(Math.random() * c.length)
        res += c[numeroAleatorio];
    }
    return res;
}