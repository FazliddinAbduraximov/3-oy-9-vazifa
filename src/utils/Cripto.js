import { compare, hash } from "bcrypt";

class Cripto{
    async encrypt(data){
        return hash(data,7);
    }
    async decrypt(data, encryptedData){
        return compare(data,encryptedData)
    }
}

export default new Cripto();