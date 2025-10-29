import jwt from 'jsonwebtoken'

export const generateToken = async (userId:string,email:string, role:string):Promise<string> =>{
    if(!process.env.JWT_SECRET){
        throw new Error("JWT SECRET is not defined in enironment variables")
    }
    const token = jwt.sign(
      { id: userId,email, role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );
    return token;
}