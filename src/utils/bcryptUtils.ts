import bcrypt from 'bcrypt';

const saltRounds = 11;

const generatehash=async (password : string)  =>{
        return await bcrypt.hash(password,saltRounds);
}

const comparepasword=async(myPlaintextPassword : string ,hash : string) =>{
    return await bcrypt.compare(myPlaintextPassword,hash);
}

export {generatehash,comparepasword}