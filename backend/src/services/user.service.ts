import db from '../db/db';
import Users from '../db/schema/user.model'
import Events from '../db/schema/event.model'
import {eq} from 'drizzle-orm'

export const findUserByEmail = async (email : string)=>{
    try {
    const [user] = await db.select({
        id: Users.id,
        email : Users.email,
        name : Users.name,
        username : Users.username,
        role : Users.role,
        profileImageUrl: Users.profileImageUrl,
        password : Users.password,
        resetOtpExpiredAt : Users.resetOtpExpiredAt,
        resetOtp : Users.resetOtp
    })
    .from(Users)
    .where((table)=> eq(table.email, email))
    return user;
    } catch (error) {
        console.error(error)
    }
}

 