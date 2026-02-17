import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
 

export const generateAccessToken = async (userId:string, role:string) =>{
    try {
        if(!process.env.JWT_SECRET){
        throw new Error("JWT SECRET is not defined in enironment variables")
    }
    const token = jwt.sign(
      { id: userId, role },
      process.env.JWT_SECRET as string,
      { expiresIn: "5min" }
    );
    return token;
    } catch (error) {
        console.error("Access token generation error",error)
    }
}

export const generateRefreshToken = async ()=>{
  const token = crypto.randomBytes(32).toString("hex");
    return token;
}

export const generateMagicLinkToken = async()=>{
const token = crypto.randomBytes(32).toString("hex");
const tokenHash = crypto
  .createHash("sha256")
  .update(token)
  .digest("hex");

  return tokenHash;

}